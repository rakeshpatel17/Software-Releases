import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './Heading.css'; // custom CSS for styling

const Heading = ({ link, name }) => {
  return (
    <div className="heading-container">
      {link && (
        <Link to="/dashboard">
          <img src={link} alt={name} className="heading-image" />
        </Link>
      )}
      {/* If no link, wrap h2 with heading-placeholder div */}
      {link ? (
        <h1 className="heading-text">{name}</h1>
      ) : (
        <div className="heading-placeholder">
          <h2 className="heading-text_main">{name}</h2>
        </div>
      )}
    </div>
  );
};

Heading.propTypes = {
  link: PropTypes.string,  // made optional
  name: PropTypes.string.isRequired,
};

export default Heading;
