import React, { useState, useEffect } from 'react';
import DropdownTreeSelect from 'react-dropdown-tree-select';
import 'react-dropdown-tree-select/dist/styles.css';
import './App.css';

const TreeDropdown = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState({});
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]); // Initialize as an array
  
  useEffect(() => {
    fetch('https://fakestoreapi.com/products/categories')
      .then(res => res.json())
      .then(categories => {
        setCategories(prevCategories => [
          ...prevCategories,
          ...categories.map(category => ({ label: category, value: category }))
        ]);

        categories.forEach(category => {
          fetch(`https://fakestoreapi.com/products/category/${category}`)
            .then(res => res.json())
            .then(products => {
              setProducts(prevProducts => ({
                ...prevProducts,
                [category]: products.map(product => ({ label: product.title, value: product.id }))
              }));
            })
            .catch(err => console.error(err));
        });
      })
      .catch(err => console.error(err));

    
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(res => res.json())
      .then(users => {
        setUsers(users.map(user => ({ label: user.name, value: user.id })));
      })
      .catch(err => console.error(err));

    fetch('https://jsonplaceholder.typicode.com/posts')
      .then(res => res.json())
      .then(posts => {
        const postPromises = posts.map(post =>
          fetch(`https://jsonplaceholder.typicode.com/posts/${post.id}/comments`) // Corrected `post.Id` to `post.id`
            .then(res => res.json())
            .then(comments => ({
              ...post,
              comments: comments.map(comment => ({ label: comment.name, value: comment.id }))
            }))
        );

        Promise.all(postPromises)
          .then(postsWithComments => {
            const postsData = postsWithComments.map(post => ({
              label: post.title,
              value: post.id,
              children: post.comments
            }));
            setPosts(postsData);
          })
          .catch(err => console.error(err));
      })
      .catch(err => console.error(err));
  }, []);

  const data = [
    ...categories.map(category => ({
      label: category.label,
      value: category.value,
      children: products[category.value] || []
    })),
    {
      label: 'Users',
      value: 'users',
      children: users
    },
    {
      label: 'Posts',
      value: 'posts',
      children: posts // Ensure posts is an array of objects with label, value, and children
    }
  ];

  return (
    <div>
      <DropdownTreeSelect data={data} />
    </div>
  );
};

export default TreeDropdown;
