import React, { useEffect, useState } from "react";
import { getFirestore, updateDoc, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { format } from 'date-fns';

import { BsCircleFill } from "react-icons/bs";
import {
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineCalendar,
  AiOutlinePlayCircle,
  AiOutlineReload,
  AiOutlinePauseCircle
} from "react-icons/ai";
import { FaCheck, FaTimes } from 'react-icons/fa';
import app from '../firebase/config';

// Instance of firestore
const db =  getFirestore(app);

const Task = ({ task }) => {

  // =========
  // Local state
  // =========

  // HandleEdit
  const handleEdit = () => {
    setIsEditing(true);
  }

  // Handle Cancel Edit
  const handleCancelEdit = () => {
    setIsEditing(false);
    setNewTaskDescription(localTask.task);
  }

  // Handle Update
  const handleUpdate = async () => {
    try {
      await updateDoc(doc(db, 'tasks', localTask.id), {
        task: newTaskDescription
      });
      // Update the state
      setLocalTask((prevState) => ({ ...prevState, task: newTaskDescription}));
      setIsEditing(false);
    } 
    catch (error) {

    }
  }

  // Handle renderTaskDescription
  const renderTaskDescription = () => {
    if (isEditing) {
      return (
        <div className="flex space-x-2">
          <input type="text" 
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            className="border border-purple-300 rounded px-2 py-1"
          />
          <FaCheck onClick={handleUpdate} className="text-green-400 cursor-pointer" />
          <FaTimes onClick={handleCancelEdit} className="text-red-400 cursor-pointer" />
        </div>
      );
    }
  }

  // Handle start
  const handleStart = async () => {
    try {
      await updateDoc(doc(db, 'tasks', localTask.id), {
        status: 'en_cours',
        startTime: Date.now()
      });
      const taskDoc = doc(db, 'tasks', localTask.id)
      onSnapshot(taskDoc, (docSnap) => {
        if (docSnap.exists())  {
          setLocalTask({
            ...docSnap.data(),
            date: localTask.date,
            id: localTask.id
          });
        }
      })
    } catch (error) {
      console.log('Error pour le lancement de la tâche: ', error);
    }
  }

  // Handle pause
  const handlePause = async () => {
    try {
      const elapsed = localTask.startTime ? Date.now() - localTask.startTime : 0;
      const newTotalTime = (localTask.totalTime || 0) + elapsed;
      await updateDoc(doc(db, 'tasks', localTask.id), { 
        status: 'en_attente',
        endTime: Date.now(),
        totalTime: newTotalTime
      });
      const taskDoc = doc(db, 'tasks', localTask.id);
      onSnapshot(taskDoc, (docSnap) => {
        if (docSnap.exists()) {
          setLocalTask({
            ...docSnap.data(),
            date: localTask.date,
            id: localTask.id
          });
        }
      })
    } catch (error) {
      console.log('Erreur lors de la mise en pause de la tâche: ', error)
    }
  }

  // Handle delete
  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, 'tasks', localTask.id));
      alert('Task deleted successfully');
    } catch (error) {
      alert('Task deleted failed');
    }
  }

  // Handle render buttons
  const handleRenderButtons = () => {
    switch(localTask.status) {
      case 'non commencé':
        return (
          <AiOutlinePlayCircle className="text-2xl text-purple-400 cursor-pointer" onClick={handleStart} />
        );

      case 'en_cours':
        return (
          <AiOutlinePauseCircle className="text-2xl text-green-400 cursor-pointer" onClick={handlePause} />
        );

      default:
        case 'non commencé':
          return (
            <AiOutlineReload className="text-2xl text-green-400 cursor-pointer" onClick={handleStart} />
          );
    }
  }


  const [localTask, setLocalTask] = useState(task);
  const [isEditing, setIsEditing] = useState(false);
  const [newTaskDescription, setNewTaskDescription] = useState(localTask.task);
  return (
    <div className="bg-white p-4 rounded-md text-black shadow-lg flex flex-col md:flex-row md:items-center justify-between">
      <div className="md:space-x-2 space-y-2 md:space-y-0">
        {/* render description */}
        {renderTaskDescription()}
        <div className="flex items-center space-x-2">
          <AiOutlineCalendar className="text-gray-600" />
          <p className="text-gray-600">{format(new Date(localTask.date), 'dd/MM/yyyy')}</p>
          <p className="text-gray-600">{task.task}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2 justify-center">
        <BsCircleFill 
          color= {localTask.status === 'en_cours' ? 'green' : localTask.status === 'en_attente' ? 'red' : 'yellow'}
        />
        <p>{ localTask.status }</p>
      </div>
      <div className="flex items-center space-x-2 justify-center md:justify-end">
        {/* Render buttons */}
        {handleRenderButtons()}
        <AiOutlineEdit onClick={handleEdit} className="text-2xl text-purple-400 cursor-pointer" />
        <AiOutlineDelete onClick={handleDelete} className="text-2xl text-red-500 cursor-pointer" />
      </div>
    </div>
  );
}

export default Task;
