import React from "react";
import { useNavigate } from "react-router-dom";
import "../help.css";

function HelpSupport() {
  const navigate = useNavigate();

  return (
    <div className="help-container">
      <button
        className="back-btn"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <h1>Help & Support</h1>

      <div className="help-card">
        <h2>Frequently Asked Questions</h2>

        <div className="faq">
          <h3>How do I create a workspace?</h3>
          <p>
            Go to Dashboard and click on Create Workspace.
          </p>
        </div>

        <div className="faq">
          <h3>How do I invite team members?</h3>
          <p>
            Open a workspace and use the Invite Member option.
          </p>
        </div>

        <div className="faq">
          <h3>How do I manage tasks?</h3>
          <p>
            Open the board and drag tasks between columns.
          </p>
        </div>

        <div className="faq">
          <h3>How do I update my profile?</h3>
          <p>
            Visit Settings and click Update Profile.
          </p>
        </div>
      </div>

      <div className="help-card">
        <h2>Contact Support</h2>

        <p>Email: support@collabspace.com</p>
        <p>Phone: +91 9876543210</p>

        <button
          className="contact-btn"
          onClick={() =>
            alert("Support request submitted!")
          }
        >
          Contact Support
        </button>
      </div>

      <div className="help-card">
        <h2>About Collab Space</h2>

        <p>
          Collab Space is a real-time collaborative workspace
          that helps teams manage projects, tasks,
          communication, and workflow efficiently.
        </p>
      </div>
    </div>
  );
}

export default HelpSupport;