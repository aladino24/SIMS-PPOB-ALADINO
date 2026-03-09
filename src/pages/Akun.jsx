import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";
import Swal from "sweetalert2";
import "./akun.css";
import profilePhoto from "../assets/Profile-Photo.png";

function Akun() {

  const [isEdit, setIsEdit] = useState(false);
  const fileInputRef = useRef(null);

  const [profileImage, setProfileImage] = useState(profilePhoto);

  const [profile, setProfile] = useState({
    email: "",
    first_name: "",
    last_name: "",
    profile_image: ""
  });

  const [tempProfile, setTempProfile] = useState(profile);

  const getProfile = async () => {
    try {

      const res = await API.get("/profile");

      const data = res.data.data;

      setProfile(data);
      setTempProfile(data);

      if (data.profile_image) {
        setProfileImage(data.profile_image);
      }

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const handleChange = (e) => {
    setTempProfile({
      ...tempProfile,
      [e.target.name]: e.target.value
    });
  };

  const handleEdit = () => {
    setIsEdit(true);
  };

  const handleCancel = () => {
    setTempProfile(profile);
    setIsEdit(false);
  };

  const handleSave = async () => {
    try {

      const res = await API.put("/profile/update", {
        first_name: tempProfile.first_name,
        last_name: tempProfile.last_name
      });

      if (res.data.status === 0) {

        setProfile(tempProfile);
        setIsEdit(false);

        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Profile berhasil diperbarui"
        });

      }

    } catch (error) {
      console.log(error);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (e) => {

    const file = e.target.files[0];

    if (!file) return;

    // VALIDASI SIZE
    if (file.size > 100 * 1024) {

      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Ukuran gambar maksimal 100kb"
      });

      return;
    }

    try {

      const formData = new FormData();
      formData.append("file", file);

      const res = await API.put("/profile/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      if (res.data.status === 0) {

        const imageUrl = URL.createObjectURL(file);
        setProfileImage(imageUrl);

        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Foto profile berhasil diupdate"
        });

      }

    } catch (error) {
      console.log(error);
    }
  };


  const handleLogout = () => {

    localStorage.removeItem("token");

    window.location.href = "/";

  };

  return (
    <div>

      <Navbar />

      <div className="akun-container">

        <div className="profile-section">

          <div className="profile-image-wrapper">

            <img
                src={profileImage || profilePhoto}
                alt="profile"
                className="profile-image"
                onClick={handleImageClick}
                onError={(e) => {
                e.target.onerror = null;
                e.target.src = profilePhoto;
                }}
            />

            <div className="edit-photo-icon" onClick={handleImageClick}>
                ✏️
            </div>

            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleImageChange}
            />

            </div>

          <h2>
            {profile.first_name} {profile.last_name}
          </h2>

        </div>

        <div className="profile-form">

          <label>Email</label>
          <input
            type="text"
            value={profile.email}
            disabled
          />

          <label>Nama Depan</label>
          <input
            type="text"
            name="first_name"
            value={tempProfile.first_name}
            onChange={handleChange}
            disabled={!isEdit}
          />

          <label>Nama Belakang</label>
          <input
            type="text"
            name="last_name"
            value={tempProfile.last_name}
            onChange={handleChange}
            disabled={!isEdit}
          />


          {!isEdit && (
            <button
              className="edit-btn"
              onClick={handleEdit}
            >
              Edit Profile
            </button>
          )}

          {isEdit && (
            <>
              <button
                className="save-btn"
                onClick={handleSave}
              >
                Simpan
              </button>

              <button
                className="cancel-btn"
                onClick={handleCancel}
              >
                Batalkan
              </button>
            </>
          )}

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </div>

    </div>
  );
}

export default Akun;