import PropTypes from 'prop-types';
import { useAuth } from '../../context/AuthContext';
import { dismissibleError } from '../Toast/customToast'; // 1. Import your toast


export default function AuthorizedAction({
  allowedRoles,
  children,
  onUnauthorized = () => dismissibleError("You are not authorized to perform this action.")
}) {
  const { user } = useAuth();
  const isAuthorized = user && allowedRoles.includes(user.role);

  if (typeof children !== 'function') {
    console.error("AuthorizedAction requires a function as its child.");
    return null;
  }
  return children(isAuthorized, onUnauthorized);
}

AuthorizedAction.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
  children: PropTypes.func.isRequired,
  onUnauthorized: PropTypes.func, // The new prop
};