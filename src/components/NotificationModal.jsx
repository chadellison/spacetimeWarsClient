import '../styles/modal.css';

export const NotificationModal = ({ title, content }) => {
  return (
    <div className="modal">
      <h2 className="informationTitle">{title}</h2>
      <p className="notificationText">{content}</p>
    </div>
  );
}