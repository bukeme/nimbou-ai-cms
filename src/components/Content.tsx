// src/components/CardGrid.tsx
import React, { useState, useEffect, FormEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

interface Card {
  id: number;
  title: string;
  text: string;
}

const CardGrid: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  // Cards state so that edits and deletions are reflected
  const [cards, setCards] = useState<Card[]>([]);

  // States to keep track of which modal is open (if any)
  const [selectedReadCard, setSelectedReadCard] = useState<Card | null>(null);
  const [selectedEditCard, setSelectedEditCard] = useState<Card | null>(null);
  const [selectedDeleteCard, setSelectedDeleteCard] = useState<Card | null>(
    null
  );

  // Create Content Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Local state for the edit form
  const [editTitle, setEditTitle] = useState("");
  const [editText, setEditText] = useState("");

  // Local states for the create form
  const [newTitle, setNewTitle] = useState("");
  const [newText, setNewText] = useState("");

  // When the edit modal opens, populate the form fields with the card data.
  useEffect(() => {
    if (selectedEditCard) {
      setEditTitle(selectedEditCard.title);
      setEditText(selectedEditCard.text);
    }
  }, [selectedEditCard]);

  const fetchContent = () => {
    axios
      .get("https://nimbou-api.stylconmarketplace.com/api/content/")
      .then((response) => {
        setCards(response.data);
      });
  };

  useEffect(() => {
    fetchContent();
  }, []);

  // Open respective modals
  const openReadModal = (card: Card) => {
    setSelectedReadCard(card);
  };

  const openEditModal = (card: Card) => {
    setSelectedEditCard(card);
  };

  const openDeleteModal = (card: Card) => {
    setSelectedDeleteCard(card);
  };

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  // Generic close function for all modals
  const closeModals = () => {
    setSelectedReadCard(null);
    setSelectedEditCard(null);
    setSelectedDeleteCard(null);
    setIsCreateModalOpen(false);
  };

  // Handle submission of the edit form
  const handleEditSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (selectedEditCard) {
      axios
        .patch(
          `https://nimbou-api.stylconmarketplace.com/api/content/${selectedEditCard.id}/`,
          { title: editTitle, text: editText }
        )
        .then((response) => {
          console.log(response);
          toast.success("Content updated successfully");
          setCards((prevCards) =>
            prevCards.map((card) =>
              card.id === selectedEditCard.id
                ? { ...card, title: editTitle, text: editText }
                : card
            )
          );
          setIsLoading(false);
          setSelectedEditCard(null);
        });
    }
  };

  // Handle deletion confirmation
  const handleDeleteConfirm = () => {
    setIsLoading(true);
    if (selectedDeleteCard) {
      axios
        .delete(
          `https://nimbou-api.stylconmarketplace.com/api/content/${selectedDeleteCard.id}/`
        )
        .then((response) => {
          console.log(response.data);
          toast.success("Content deleted successfully");
          setCards((prevCards) =>
            prevCards.filter((card) => card.id !== selectedDeleteCard.id)
          );
          setSelectedDeleteCard(null);
          setIsLoading(false);
        });
    }
  };

  // Handle submission of the create form
  const handleCreateSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const newCard = {
      title: newTitle,
      text: newText,
    };
    axios
      .post("https://nimbou-api.stylconmarketplace.com/api/content/", newCard)
      .then((response) => {
        console.log(response);
        fetchContent();
        // Reset the form fields and close the modal
        setNewTitle("");
        setNewText("");
        setIsLoading(false);
        setIsCreateModalOpen(false);
      });
  };
  console.log(!cards.length);

  return (
    <div className="container mx-auto p-4">
      <div className="relative pb-14 md:pb-0 mb-4">
        <h1 className="text-center font-medium text-3xl">
          Content Management System
        </h1>
        <button
          onClick={openCreateModal}
          className="cursor-pointer absolute bottom-0 md:bottom-auto left-1/2 md:left-auto -translate-x-1/2 md: translate-x-auto md:-translate-y-1/2 md:top-1/2 md:right-0 bg-green-500 text-sm text-white px-3 py-2 rounded hover:bg-green-600 space-x-3"
        >
          <FontAwesomeIcon icon={faPlus} />
          <span>Create Content</span>
        </button>
      </div>

      {/* Grid of Cards */}
      {cards.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div
              key={card.id}
              className="bg-white shadow rounded-lg p-4 flex flex-col"
            >
              <h2 className="text-lg font-bold mb-2">{card.title}</h2>
              <p className="text-gray-700 mb-4 line-clamp-3">{card.text}</p>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => openReadModal(card)}
                  className="text-blue-500 hover:underline"
                >
                  Read more..
                </button>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openEditModal(card)}
                    className="bg-blue-500 text-white text-sm px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => openDeleteModal(card)}
                    className="bg-red-500 text-white text-sm px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center mt-24">
          <ClipLoader
            color="gray"
            loading={!(cards as Card[]).length}
            size={50}
          />
        </div>
      )}

      {/* Read More Modal */}
      {selectedReadCard && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={closeModals}
          />
          <div className="bg-white rounded-lg shadow-lg relative z-10 w-11/12 md:w-3/4 lg:w-1/2 max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{selectedReadCard.title}</h3>
              <button
                onClick={closeModals}
                className="text-gray-600 hover:text-gray-800"
              >
                <FontAwesomeIcon icon={faTimes} className="text-2xl" />
              </button>
            </div>
            <div>
              <p className="text-gray-700">{selectedReadCard.text}</p>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {selectedEditCard && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={closeModals}
          />
          <div className="bg-white rounded-lg shadow-lg relative z-10 w-11/12 md:w-3/4 lg:w-1/2 max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Edit Card</h3>
              <button
                onClick={closeModals}
                className="text-gray-600 hover:text-gray-800"
              >
                <FontAwesomeIcon icon={faTimes} className="text-2xl" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="editTitle">
                  Title
                </label>
                <input
                  id="editTitle"
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="editText">
                  Text
                </label>
                <textarea
                  id="editText"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
                ></textarea>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {selectedDeleteCard && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={closeModals}
          />
          <div className="bg-white rounded-lg shadow-lg relative z-10 w-11/12 md:w-3/4 lg:w-1/3 max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Delete Card</h3>
              <button
                onClick={closeModals}
                className="text-gray-600 hover:text-gray-800"
              >
                <FontAwesomeIcon icon={faTimes} className="text-2xl" />
              </button>
            </div>
            <div className="mb-4">
              <p className="text-gray-700">
                Are you sure you want to delete{" "}
                <span className="font-bold">{selectedDeleteCard.title}</span>?
              </p>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeModals}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                disabled={isLoading}
                onClick={handleDeleteConfirm}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Content Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={closeModals}
          />
          <div className="bg-white rounded-lg shadow-lg relative z-10 w-11/12 md:w-3/4 lg:w-1/2 max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Create Content</h3>
              <button
                onClick={closeModals}
                className="text-gray-600 hover:text-gray-800"
              >
                <FontAwesomeIcon icon={faTimes} className="text-2xl" />
              </button>
            </div>
            <form onSubmit={handleCreateSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="newTitle">
                  Title
                </label>
                <input
                  id="newTitle"
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="newText">
                  Text
                </label>
                <textarea
                  id="newText"
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
                  required
                ></textarea>
              </div>
              <div className="flex justify-end">
                <button
                  disabled={isLoading}
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardGrid;
