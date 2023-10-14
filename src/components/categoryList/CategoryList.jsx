import React from 'react'
import styles from "./categoryList.module.css"
import Link from 'next/link'
import Image from 'next/image'

const categories = [
  {id: 1, title: "Style", name: "style"},
  {id: 2, title: "Fashion", name: "fashion"},
  {id: 3, title: "Food", name: "food"},
  {id: 4, title: "Travel", name: "travel"},
  {id: 5, title: "Culture", name: "culture"},
  {id: 6, title: "Coding", name: "coding"},
]

const getData = async () => {
  const res = await fetch("http://localhost:3000/api/categories", {
    cache: "no-store",
  })

  if (!res.ok) {
    //throw new Error("Failed")
    console.log("Failed")
  }

  return res.json()
}
const CategoryList = async () => {
  const data = await getData()
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Popular categories</h1>
      <div className={styles.categories}>
        {data?.map(({ id, slug, title, img }) => (
          <Link
            href={`/blog?cat=${slug}`}
            className={`${styles.category} ${styles[slug]}`}
            key={id}
          >
            {img && <Image
              src={img}
              alt=""
              width={32}
              height={32}
              className={styles.image}
            />}
            {title}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default CategoryList