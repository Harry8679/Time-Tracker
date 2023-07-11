import React, { useState } from "react";
import { AiOutlineFieldTime } from "react-icons/ai";
import { addDoc, getFirestore, collection } from 'firebase/firestore';
import { useNavigate } from "react-router-dom";
import { getAuth } from 'firebase/auth';
import app from '../firebase/config';

// Instance of firestore
const db = getFirestore(app);
// Instance of auth
const auth = getAuth(app);

function CreateTaskPage() {
  const [task, setTask] = useState();
  const [loading, setLoading] = useState();
  const [error, setError] = useState();
  const [success, setSuccess] = useState();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setSuccess(false);
      // Save task into DB
      addDoc(collection(db, 'tasks'), {
        task: task.trim(),
        status: 'non commencé',
        startTime: null,
        endTime: null,
        userId: auth.currentUser.uid
      });
      setSuccess(true);
      setTask('');
      // navigate('/reports');
    } catch (error) {
      setError('Une erreur s\'est produite lors de la création de la tâche: ' + error.message);
    }
  }
  return (
    <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 min-h-screen flex items-center justify-center">
      <div className="bg-white bg-opacity-10 p-10 rounded-lg backdrop-filter backdrop-blur-lg shadow-lg max-w-md w-full">
        <h1 className="text-4xl font-bold text-white mb-4 text-shadow flex items-center space-x-2">
          <AiOutlineFieldTime />
          <span>Créer une tâche</span>
        </h1>
        <p className="text-white text-opacity-80 mb-8">
          Transformez vos projets en tâches réalisables. 
          Commencer par créer une tâche.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <label htmlFor="task" className="block font-bold text-white mb-2">
              Description de la tâche
            </label>
            <input
              type="text"
              id="task"
              required
              value={task}
              onChange={(e) => setTask(e.target.value)}
              className="w-full bg-transparent bg-opacity-50 text-white border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white placeholder-white"
              placeholder="ex: Créer un Projet React Complet"
              style={{
                color: "white",
                textShadow: "0 0 10px rgba(0,0,0,0.25)",
              }}
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 bg-opacity-50 hover:bg-opacity-75 text-white py-3 px-6 rounded focus:outline-none focus:ring-2 focus:ring-white"
            >
              {loading ? 'En chargement ...': 'Créer une tâche'}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          {success && (
            <p className="text-green-500 text-sm mt-2">
              Tâche créée avec succès
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default CreateTaskPage;
