import React, { useState, useEffect, useContext } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../../../firebase";
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Layout from "../../../components/layout/Layout";
import "./editProfile.scss";
import { useDispatch, useSelector } from "react-redux";
import { userUpdated } from "../../../redux/loginSlice";

const EditProfile = () => {
  const authUser = useSelector((state) => state.login.user);
  const dispatch = useDispatch();

  const userID = authUser.uid;

  const [profile, setProfile] = useState(authUser);

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Edit Profile | FakeInsta";
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const userRef = doc(db, "users", userID);
      const userSnap = await getDoc(userRef);
      // console.log("userId", userID);

      if (userSnap.exists()) {
        // console.log("Document data:", docSnap.data());
        const { profilePicURL, username, fullName, bio, website_url } =
          userSnap.data();

        setProfile(() => ({
          profilePicURL,
          username,
          fullName,
          bio,
          website_url,
        }));
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
      }
    };
    fetchData();
  }, [userID]);

  const handleImageChange = async (e) => {
    const selectedFile = e.target.files[0];
    // console.log("image", selectedFile);

    if (selectedFile) {
      const newImageName = crypto.randomUUID();
      const renamedFile = new File([selectedFile], newImageName, {
        type: selectedFile.type,
      });

      const storageRef = ref(storage, renamedFile.name);
      const uploadTask = uploadBytesResumable(storageRef, renamedFile);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          // Handle unsuccessful uploads
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            const userRef = doc(db, "users", userID);

            // Set the "capital" field of the city 'DC'
            await updateDoc(userRef, {
              profilePicURL: downloadURL,
            });

            // localStorage.setItem(
            //   "user",
            //   JSON.stringify({ ...user, profilePicURL: downloadURL })
            // );
            setProfile((prev) => ({ ...prev }));
            // console.log("user", user);

            // console.log("File available at", downloadURL);
          });
        }
      );
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userRef = doc(db, "users", userID);

      await updateDoc(userRef, {
        bio: profile.bio,
        website_url: profile.website_url,
      });

      // updateAuthUser(authUser.uid);
      dispatch(userUpdated(authUser.uid));

      navigate(-1);
    } catch (e) {
      console.error("error", e);
    }
  };

  return (
    <Layout>
      <div className="editProfile ">
        <h3>Edit Profile</h3>
        <div className="photoChange">
          <div className="left ">
            <div className="profilePicURL  flex items-center justify-center">
              {profile.profilePicURL ? (
                <img src={`${profile.profilePicURL}`} />
              ) : (
                <AccountCircleIcon
                  style={{ width: "60px", height: "60px" }}
                  className="rounded "
                />
              )}
            </div>

            <div className="profile-info">
              <p className="font-semibold ">{profile.username}</p>
              <p className="text-[0.8rem]">{profile.fullName}</p>
            </div>
          </div>
          <div className="right">
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <label>
                <span>change photo</span>
                <input
                  type="file"
                  name="profile_image"
                  id=""
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </label>
            </form>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="form">
          <fieldset>
            <label htmlFor="">website_url</label>
            <input
              type="text"
              name="website_url"
              id=""
              value={profile.website_url}
              onChange={handleChange}
              placeholder="website_url"
              className="website_url"
            />
            <span className="">
              Editing your links is only available on mobile. Visit the
              Instagram app and edit your profile to change the website_urls in
              your bio.
            </span>
          </fieldset>

          <fieldset>
            <label htmlFor="">Bio</label>
            <input
              type="text"
              name="bio"
              id=""
              value={profile.bio}
              onChange={handleChange}
              placeholder="Bio"
              className=""
            />
          </fieldset>

          <div className="flex items-center justify-center md:justify-end">
            <button className="w-[200px] bg-[#1877f2] py-2.5 font-semibold rounded-lg  my-7 ">
              Submit
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditProfile;
