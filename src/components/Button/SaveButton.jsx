
    const SaveButton = () => (
        <button 
          type="submit" 
          style={{
            alignSelf: 'auto',
            padding: '10px 18px',
            backgroundColor: '#27a844',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#1f8635'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#27a844'}
        >
          SAVE
        </button>
      
      
);

export default SaveButton;
