import PropTypes from 'prop-types';
import './DropdownItem.css';
import { Link } from 'react-router-dom';

function DropdownItem({ iconClass, name, hyperlink }) {
  return (
    <Link to={hyperlink} className="dropdown-item">
      <i className={`dropdown-item-icon ${iconClass}`}></i>
      <span className="dropdown-item-name">{name}</span>
    </Link>
  );
}

DropdownItem.propTypes = {
  iconClass: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  hyperlink: PropTypes.string.isRequired,
};

export default DropdownItem;
