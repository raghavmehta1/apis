import React, { useState, useEffect } from 'react';
import DropdownTreeSelect from 'react-dropdown-tree-select';
import 'react-dropdown-tree-select/dist/styles.css';
import './App.css';

const TreeDropdown = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState({});
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('https://fakestoreapi.com/products/categories')
      .then(res => res.json())
      .then(categories => {
        setCategories(categories.map(category => ({ label: category, value: category })));

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
    }
  ];

  return (
    <div>
      <DropdownTreeSelect data={data} />
    </div>
  );
};

export default TreeDropdown;