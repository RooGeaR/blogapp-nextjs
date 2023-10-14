"use client"
import Image from "next/image"
import styles from "./writePage.module.css"
import { useEffect, useState } from "react"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.bubble.css"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "@/utils/firebase"

const storage = getStorage(app);

const WritePage = () => {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [file, setFile] = useState(null)
  const [media, setMedia] = useState("")
  const [title, setTitle] = useState("")
  const [catSlug, setCatSlug] = useState("")

  const {status} = useSession() 
  // Build production
  //const ReactQuill = dynamic(() => import("react-quill"), {ssr: false})

  const router = useRouter()

  useEffect(() => {
    const upload = () => {
      const name = new Date().getTime() + file.name
      const storageRef = ref(storage, name);

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
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setMedia(downloadURL);
          });
        }
      );
    };

    file && upload();
  }, [file]);

  if (status === "loading") {
    return <div className={styles.loading}>Loading...</div>
  }

  if (status === "unauthenticated") {
    router.push("/")
  }

  function slugify(str) {
    return String(str)
      .normalize('NFKD') // split accented characters into their base characters and diacritical marks
      .replace(/[\u0300-\u036f]/g, '') // remove all the accents, which happen to be all in the \u03xx UNICODE block.
      .trim() // trim leading or trailing whitespace
      .toLowerCase() // convert to lowercase
      .replace(/[^a-z0-9 -]/g, '') // remove non-alphanumeric characters
      .replace(/\s+/g, '-') // replace spaces with hyphens
      .replace(/-+/g, '-'); // remove consecutive hyphens
  }

  const handleSubmit = async () => {
    const res = await fetch("/api/posts", {
      method: "POST",
      body: JSON.stringify({
        title,
        desc: value,
        img: media,
        slug: slugify(title),
        catSlug: catSlug || "style"
      }),
    });

    if (res.status === 200) {
      const data = await res.json()
      router.push(`/posts/${data.slug}`)
    }
  };

  return (
    <div className={styles.container}>
      <input type="text" placeholder="title" className={styles.input} onChange={(e)=>setTitle(e.target.value)}/>
      <select className={styles.select} onChange={(e) => setCatSlug(e.target.value)}>
        <option value="style">style</option>
        <option value="fashion">fashion</option>
        <option value="food">food</option>
        <option value="culture">culture</option>
        <option value="travel">travel</option>
        <option value="style">coding</option>
      </select>
      <div className={styles.editor}>
        <button className={styles.button} onClick={() => setOpen(!open)}>
          <Image src="/plus.png" alt="" width={16} height={16} />
        </button>
        {open && (
          <div className={styles.add}>
            <input
              type="file"
              id="image"
              onChange={(e) => setFile(e.target.files[0])}
              style={{ display: "none" }}
            />

            <button className={styles.addButton}>
              <label htmlFor="image">
                <Image src="/image.png" alt="" width={16} height={16} />
              </label>
            </button>

            <button className={styles.addButton}>
              <Image src="/external.png" alt="" width={16} height={16} />
            </button>
            <button className={styles.addButton}>
              <Image src="/video.png" alt="" width={16} height={16} />
            </button>
          </div>
        )}
        <ReactQuill
          className={styles.textArea}
          theme="bubble"
          value={value}
          onChange={setValue}
          placeholder="Tell your story..."
        />
      </div>
      <button className={styles.publish} onClick={handleSubmit}>Publish</button>
    </div>
  );
}

export default WritePage