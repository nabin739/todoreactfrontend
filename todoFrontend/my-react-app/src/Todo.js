import React, { useEffect, useState } from 'react';

export default function Todo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [items, setItems] = useState([]);
  const [error, setError] = useState(""); 
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const apiUrl = "http://localhost:8000";

  const handleSubmit = () => {
    setError("");

    if (title.trim() !== "" && description.trim() !== "") {
      fetch(`${apiUrl}/todo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ title, description })
      })
        .then((res) => {
          if (res.ok) {
            getItems();
            setMessage("Item added successfully");
            setTitle("");
            setDescription("");
            setTimeout(() => setMessage(""), 3000);
          } else {
            setError("Failed to add item");
          }
        })
        .catch(() => {
          setError("Unable to add item");
        });
    } else {
      setError("Both fields are required");
    }
  };

  const getItems = () => {
    fetch(`${apiUrl}/todo`)
      .then((res) => res.json())
      .then((res) => setItems(res));
  };

  useEffect(() => {
    getItems();
  }, []);

  const handleDelete = (id) => {
    fetch(`${apiUrl}/todo/${id}`, {
      method: "DELETE"
    }).then((res) => {
      if (res.ok) {
        setItems(items.filter(item => item._id !== id));
        setMessage("Item deleted successfully");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setError("Failed to delete item");
      }
    }).catch(() => {
      setError("Unable to delete item");
    });
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setEditTitle(item.title);
    setEditDescription(item.description);
  };
  
  const handleUpdate = () => {
    fetch(`${apiUrl}/todo/${editId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title: editTitle, description: editDescription })
    }).then((res) => {
      if (res.ok) {
        getItems();
        setEditId(null);
        setEditTitle("");
        setEditDescription("");
        setMessage("Item updated successfully");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setError("Failed to update item");
      }
    }).catch(() => {
      setError("Unable to update item");
    });
  };

  return (
    <>
      <div className="row p-3 bg-success text-white">
        <h1>Todo Project with MernStack</h1>
      </div>

      <div className="row">
        <h3>Add Item</h3>
        {message && <p className="text-success">{message}</p>}
        <div className="form-group gap-2 d-flex">
          <input
            placeholder="Title"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            className="form-control"
            type="text"
          />
          <input
            placeholder="Description"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className="form-control"
            type="text"
          />
          <button className="btn btn-dark" onClick={handleSubmit}>
            Submit
          </button>
        </div>
        {error && <p className="text-danger">{error}</p>}
      </div>

      <div className="row mt-3">
        <h3>Tasks</h3>
        <ul className="list-group">
          {items.map((item) => (
            <li key={item._id} className="list-group-item d-flex justify-content-between bg-info align-items-center my-2">
              {editId === item._id ? (
                <div className="d-flex flex-column gap-2 w-75">
                  <input
                    type="text"
                    className="form-control"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                  <input
                    type="text"
                    className="form-control"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                  />
                </div>
              ) : (
                <div className="d-flex flex-column">
                  <span className="fw-bold">{item.title}</span>
                  <span>{item.description}</span>
                </div>
              )}
              <div className="d-flex gap-2">
                {editId === item._id ? (
                  <button className="btn btn-success" onClick={handleUpdate}>Update</button>
                ) : (
                  <button className="btn btn-dark" onClick={() => handleEdit(item)}>Edit</button>
                )}
                <button className="btn btn-danger" onClick={() => handleDelete(item._id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
