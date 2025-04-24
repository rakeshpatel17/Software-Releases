import React, { useState } from 'react';
import './Form.css';

function Form() {
  const [formData, setFormData] = useState({
    name: '',
    release: 'Release 1',
    releaseDate: '',
    description: '',
    patchVersion: '',
    patchState: 'New',
    isDeleted: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted Form:', formData);
    // Add API POST call here
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Name</label>
        <input
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Release</label>
        <select
          name="release"
          value={formData.release}
          onChange={handleChange}
          className="form-select"
        >
          <option>Release 1</option>
          <option>Release 2</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Release date</label>
        <input
          type="date"
          name="releaseDate"
          value={formData.releaseDate}
          onChange={handleChange}
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className="form-textarea"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Patch version</label>
        <input
          name="patchVersion"
          value={formData.patchVersion}
          onChange={handleChange}
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Patch state</label>
        <select
          name="patchState"
          value={formData.patchState}
          onChange={handleChange}
          className="form-select"
        >
          <option value="New">New</option>
          <option value="Released">Released</option>
          <option value="Verified">Verified</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <div className="checkbox-group">
        <input
          type="checkbox"
          name="isDeleted"
          checked={formData.isDeleted}
          onChange={handleChange}
          id="isDeleted"
        />
        <label htmlFor="isDeleted" style={{ marginLeft: '8px' }}>Is deleted</label>
      </div>

      <button type="submit" className="submit-button">
        SAVE
      </button>
    </form>
  );
}

export default Form;
