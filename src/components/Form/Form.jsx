import React, { useState,useEffect } from 'react';
import './Form.css';
import post_patches from '../../api/post_patches';
import get_release from '../../api/release';

function Form({ onCancel, lockedRelease }) {
  const [formData, setFormData] = useState({
    name: '',
    release: 'Release 1',
    release_date: '', 
    description: '',
    patch_version: '',
    patch_state: 'new',
    is_deleted: false,
  });
  const [releaseList, setReleaseList] = useState([]);

  // useEffect(() => {
  //   const fetchReleases = async () => {
  //     const data = await get_release();
  //     if (data && data.length > 0) {
  //       setReleaseList(data);
  //       setFormData((prev) => ({
  //         ...prev,
  //         release: data[0].id, // first release ID as default
  //       }));
  //     }
  //   };

  //   fetchReleases();
  // }, []);
  useEffect(() => {
    const fetchReleases = async () => {
      const data = await get_release();
      if (data && data.length > 0) {
        setReleaseList(data);
  
        setFormData((prev) => ({
          ...prev,
          release: lockedRelease || data[0].id, // use lockedRelease if present
        }));
      }
    };
  
    fetchReleases();
  }, [lockedRelease]);
  

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  console.log('Submitted Form:', formData);

  try {
    const response = await post_patches(formData);
    console.log('Response from post_patches:', response);
  } catch (error) {
    console.error('Error in handleSubmit:', error);
  }
};


return (
  <form className="form-container" onSubmit={handleSubmit}>
    {/* Form fields... */}
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
      disabled={!!lockedRelease} // disable if lockedRelease is passed
    >
      {lockedRelease ? (
        <option>{lockedRelease}</option> // just show the string
      ) : (
        releaseList.map((release) => (
          <option key={release.id} value={release.id}>
            {release.name}
          </option>
        ))
      )}
    </select>
      </div>

    <div className="form-group">
      <label className="form-label">Release date</label>
      <input
        type="date"
        name="release_date"
        value={formData.releaseDate}
        onChange={handleChange}
        className="form-input"
        min={new Date().toISOString().split("T")[0]}
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
        name="patch_version"
        value={formData.patchVersion}
        onChange={handleChange}
        className="form-input"
      />
    </div>

    <div className="form-group">
      <label className="form-label">Patch state</label>
      <select
        name="patch_state"
        value={formData.patchState}
        onChange={handleChange}
        className="form-select"
      >
        <option value="new">New</option>
        <option value="released">Released</option>
        <option value="verified">Verified</option>
        <option value="rejected">Rejected</option>
      </select>
    </div>

    <div className="checkbox-group">
      <input
        type="checkbox"
        name="is_deleted"
        checked={formData.isDeleted}
        onChange={handleChange}
        id="isDeleted"
      />
      <label htmlFor="isDeleted">Is deleted</label>
    </div>

    <div className="form-actions">
      <button type="button" className="cancel-button" onClick={onCancel}>
        Cancel
      </button>
      <button type="submit" className="submit-button">
        SAVE
      </button>
    </div>
  </form>
);
}

export default Form;