import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";
import UserDetailsModal from "./UserDetailsModal";
import {
  fetchUserDetails,
  uploadCertificates,
  deleteCertificate,
  addSkill,
  deleteSkill,
} from "../actions";

const Profile = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [certificates, setCertificates] = useState([]);
  const certificateInputRef = useRef(null);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [skill, setSkill] = useState("");

  useEffect(() => {
    if (props.user) {
      props.fetchUserDetails(props.user.email);
    }
  }, [props.user]);

  useEffect(() => {
    if (props.userDetails.certificates) {
      setCertificates(props.userDetails.certificates);
    }
  }, [props.userDetails.certificates]);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleCertificateUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      props.uploadCertificates(props.user.email, files);
    }
  };

  const handleCertificateClick = (cert) => {
    setSelectedCertificate(cert);
  };

  const handleCertificateDelete = (cert) => {
    props.deleteCertificate(props.user.email, cert);
    setSelectedCertificate(null);
  };

  const handleAddSkill = () => {
    if (skill.trim() !== "") {
      props.addSkill(props.user.email, skill.trim());
      setSkill("");
    }
  };

  const handleDeleteSkill = (skill) => {
    props.deleteSkill(props.user.email, skill);
  };

  return (
    <Container>
      {!props.user && <Navigate to="/" />}
      <ProfileSection>
        <ProfileCard>
          <div>
            {props.user && props.user.photoURL ? (
              <img
                className="profileImg"
                src={props.user.photoURL}
                alt="User"
              />
            ) : (
              <img className="profileImg" src="/images/user.svg" alt=" " />
            )}
            <UserInfo>
              <h2>{props.user ? props.user.displayName : "User Name"}</h2>
              <p>{props.user ? props.user.email : "user@example.com"}</p>
              <h3>{props.userDetails.headline}</h3>
              <h3>Branch: {props.userDetails.branch}</h3>
              <h3>Semester: {props.userDetails.semester}</h3>
              {props.userDetails.links && (
                <h3>
                  <a
                    href={props.userDetails.links}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Coding Link: {props.userDetails.links}
                  </a>
                </h3>
              )}
            </UserInfo>
          </div>
          <ProfileActions>
            <button onClick={toggleModal}>Edit Profile</button>
          </ProfileActions>
        </ProfileCard>
        <SkillsCard>
          <div>
            <h3>Skills</h3>
            <SkillInput>
              <input
                type="text"
                placeholder="Add a skill"
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
              />
              <button onClick={handleAddSkill}>Add Skill</button>
            </SkillInput>
            <SkillList>
              {props.userDetails.skills &&
                props.userDetails.skills.map((skill, index) => (
                  <SkillItem key={index}>
                    {skill}
                    <button onClick={() => handleDeleteSkill(skill)}>
                      Delete
                    </button>
                  </SkillItem>
                ))}
            </SkillList>
          </div>
        </SkillsCard>
        <CertificatesCard>
          <div>
            <h3>Certificates</h3>
            <input
              type="file"
              multiple
              ref={certificateInputRef}
              style={{ display: "none" }}
              onChange={handleCertificateUpload}
            />
            <button onClick={() => certificateInputRef.current.click()}>
              Upload Certificates
            </button>
            <CertificatesGrid>
              {certificates.map((cert, index) => (
                <CertificateItem
                  key={index}
                  onClick={() => handleCertificateClick(cert)}
                >
                  <img className="certificate" src={cert.url} alt={cert.name} />
                </CertificateItem>
              ))}
            </CertificatesGrid>
          </div>
        </CertificatesCard>
      </ProfileSection>
      {selectedCertificate && (
        <EnlargedCertificate>
          <img src={selectedCertificate.url} alt={selectedCertificate.name} />
          <div>
            <button onClick={() => setSelectedCertificate(null)}>Close</button>
            <button
              onClick={() => handleCertificateDelete(selectedCertificate)}
            >
              Delete
            </button>
          </div>
        </EnlargedCertificate>
      )}
      <UserDetailsModal
        showModal={showModal ? "open" : "close"}
        handleClick={toggleModal}
      />
    </Container>
  );
};

const Container = styled.div`
  padding-top: 100px;
  grid-area: main;
  margin: 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "Arial", sans-serif;
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  max-width: 1200px;
`;

const CommonCard = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #d1d1d1;
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
`;

const ProfileCard = styled(CommonCard)`
  width: 30%;
  min-height: 450px;

  .profileImg {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    margin-bottom: 20px;
    border: 3px solid #001838;
  }
`;

const SkillsCard = styled(CommonCard)`
  width: 30%;
  min-height: 450px;
`;

const CertificatesCard = styled(CommonCard)`
  width: 30%;
  min-height: 450px;

  .certificate {
    height: 100px;
    width: 150px;
    cursor: pointer;
    transition: transform 0.3s, box-shadow 0.3s;

    &:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
  }
`;

const CertificatesGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
`;

const CertificateItem = styled.div`
  cursor: pointer;
`;

const ProfileActions = styled.div`
  margin-top: 20px;

  button {
    margin: 0 10px;
    padding: 10px 20px;
    color: #001838;
    background-color: #fff;
    border: 2px solid #001838;
    border-radius: 20px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.3s, transform 0.3s;

    &:hover {
      background-color: #f0f0f0;
      transform: translateY(-2px);
    }
  }
`;

const UserInfo = styled.div`
  text-align: center;

  h2 {
    margin: 0;
    font-size: 28px;
    color: #001838;
    font-weight: bold;
  }

  p {
    margin: 5px 0;
    color: rgba(0, 0, 0, 0.7);
    font-size: 16px;
  }

  h3 {
    margin: 10px 0;
    font-size: 16px;
    color: rgba(0, 0, 0, 0.9);
  }
`;

const EnlargedCertificate = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;

  img {
    max-width: 90%;
    max-height: 90%;
    border: 3px solid #fff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  div {
    position: absolute;
    top: 20px;
    right: 20px;
    display: flex;
    gap: 10px;

    button {
      padding: 10px 20px;
      color: #001838;
      background-color: #fff;
      border: 2px solid #001838;
      border-radius: 20px;
      cursor: pointer;
      font-weight: bold;
      transition: background-color 0.3s, transform 0.3s;

      &:hover {
        background-color: #f0f0f0;
        transform: translateY(-2px);
      }
    }
  }
`;

const SkillInput = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;

  input {
    padding: 10px;
    width: 200px;
    border: 2px solid #001838;
    border-radius: 20px 0 0 20px;
    outline: none;
  }

  button {
    padding: 10px 20px;
    color: #fff;
    background-color: #001838;
    border: 2px solid #001838;
    border-radius: 0 20px 20px 0;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.3s, transform 0.3s;

    &:hover {
      background-color: #002a6c;
      transform: translateY(-2px);
    }
  }
`;

const SkillList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 20px;
`;

const SkillItem = styled.li`
  margin: 5px 0;
  padding: 10px 20px;
  background-color: #f0f0f0;
  border: 2px solid #001838;
  border-radius: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  button {
    margin: 0 10px;
    padding: 5px 10px;
    color: #001838;
    background-color: #fff;
    border: 2px solid #001838;
    border-radius: 10px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.3s, transform 0.3s;

    &:hover {
      background-color: #f0f0f0;
      transform: translateY(-2px);
    }
  }
`;

const mapStateToProps = (state) => ({
  user: state.userState.user,
  userDetails: state.userState.userDetails,
});

const mapDispatchToProps = (dispatch) => ({
  fetchUserDetails: (userEmail) => dispatch(fetchUserDetails(userEmail)),
  uploadCertificates: (userEmail, certificates) =>
    dispatch(uploadCertificates(userEmail, certificates)),
  deleteCertificate: (userEmail, certificate) =>
    dispatch(deleteCertificate(userEmail, certificate)),
  addSkill: (userEmail, skill) => dispatch(addSkill(userEmail, skill)),
  deleteSkill: (userEmail, skill) => dispatch(deleteSkill(userEmail, skill)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
