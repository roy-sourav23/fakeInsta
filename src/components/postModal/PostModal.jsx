import React, { useContext, useRef, useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {
  collection,
  addDoc,
  serverTimestamp,
  arrayUnion,
  doc,
  updateDoc,
} from "firebase/firestore";
import { storage, db } from "../../../firebase.js";
import UserContext from "../../context/UserContext.jsx";
import { Box, Modal } from "@mui/material";
import {
  CropOriginalOutlined as CropOriginalOutlinedIcon,
  CloseOutlined as CloseOutlinedIcon,
} from "@mui/icons-material";
import "./postModal.scss";

const PostModal = ({ open, handleClose }) => {
  const { authUser, updateAuthUser } = useContext(UserContext);
  const [tempImageFile, setTempImageFile] = useState(null);
  const [postDetails, setPostDetails] = useState({
    id: null,
    caption: "",
    mediaURL: "",
    likes: [],
    comments: [],
    createdAt: "",
    createdBy: authUser.uid,
  });
  const form1Ref = useRef(null);
  const form2Ref = useRef(null);

  // console.log("postDetails", postDetails);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPostDetails((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // console.log("inside handlesubmit");
    // Add a new document with a generated id.
    const docRef = await addDoc(collection(db, "posts"), {
      ...postDetails,
      createdAt: serverTimestamp(),
    });

    // addding the post to users collection
    const userRef = doc(db, "users", authUser.uid);
    await updateDoc(userRef, {
      posts: arrayUnion(docRef.id),
    });

    updateAuthUser();

    handleClose();
    setTempImageFile(null);
    setPostDetails({
      id: null,
      caption: "",
      mediaURL: "",
      likes: [],
      comments: [],
      createdAt: "",
      createdBy: authUser.uid,
    });
  };

  // post image
  const postMedia = (file) => {
    const storageRef = ref(storage, file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
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
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setPostDetails((prevData) => ({
            ...prevData,
            mediaURL: downloadURL,
            id: crypto.randomUUID(),
          }));
        });
      }
    );
  };

  const onImageSelection = (e) => {
    const mediaFile = e.target.files[0];
    if (mediaFile) {
      const tempFilePath = URL.createObjectURL(mediaFile);
      setTempImageFile(tempFilePath);
    }

    const newFileName = crypto.randomUUID();
    const renamedFile = new File([mediaFile], newFileName, {
      type: mediaFile.type,
    });
    postMedia(renamedFile);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="box relative">
        <p className="box-title">Create new post</p>

        <div className="box-body">
          <div className="content">
            {tempImageFile ? (
              <div className=" w-full h-full">
                <img
                  src={tempImageFile}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="py-4">
                <CropOriginalOutlinedIcon className="icon" />
                <p>Add photos here</p>
                <form
                  ref={form1Ref}
                  onSubmit={(e) => {
                    e.preventDefault();
                  }}
                >
                  <label>
                    <span>Select From Computer</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={onImageSelection}
                      className="hidden"
                    />
                  </label>
                </form>
              </div>
            )}
          </div>
          <div className="info">
            <div className="flex items-center gap-3 pt-3 pb-4">
              <div className="w-[2.3rem] h-[2.3rem] rounded-full bg-red-300 overflow-hidden">
                <img
                  src={`${authUser.profilePicURL}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-white font-medium text-[1rem]">
                {authUser.username}
              </p>
            </div>

            <form ref={form2Ref} onSubmit={handleSubmit} className="">
              <label>
                <textarea
                  name="caption"
                  placeholder="Write a caption..."
                  onChange={handleChange}
                  value={postDetails.caption}
                  className="outline-none border-none w-full bg-transparent text-[0.9rem] h-[6rem] md:h-[12rem] p-2 overflow-auto select-none resize-none"
                ></textarea>
              </label>
              <button type="submit">submit</button>
            </form>
          </div>
        </div>

        <button type="button" onClick={handleClose} className="closing-btn">
          <CloseOutlinedIcon />
        </button>
      </Box>
    </Modal>
  );
};

export default PostModal;
