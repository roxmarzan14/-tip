import { initializeApp } from 'firebase/app'
import {
  getFirestore, collection, onSnapshot,
  addDoc, deleteDoc, doc,
  query, where,
  orderBy, serverTimestamp,
  updateDoc
} from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyB1SLcm0m_p1VGeR4zR52kTaxhmY1FiBvI",
    authDomain: "art-gallery-1314f.firebaseapp.com",
    projectId: "art-gallery-1314f",
    storageBucket: "art-gallery-1314f.appspot.com",
    messagingSenderId: "283025157331",
    appId: "1:283025157331:web:d2cd4ac29025388ac8b826"
};

$(document).ready(function(){
    // init firebase
    initializeApp(firebaseConfig)

    // init services
    const db = getFirestore()

    // collection ref
    const colRef = collection(db, 'books')

    // realtime collection data
    onSnapshot(colRef, (snapshot) => {
        let books = []
        snapshot.docs.forEach(doc => {
            books.push({ ...doc.data(), id: doc.id })
        })

        $('.blog-list .blog-link').remove();
        $('.blog-list br').remove();
        $('.blog-list-main .blog-link').remove();
        $('.blog-list-main br').remove();
        $('.blog-list-main .remove').remove();

        for (let i = 0; i < books.length; i++) {
            var bookTitle = (books[i].title);
            var bookIndex = (books[i].id);
            $('.blog-list').append('<p class="blog-link" data-id="' + bookIndex + '"' + '>' + bookTitle + '</p>' + '<br>');
            $('.blog-list-main').append('<p class="blog-link" id="' + bookIndex + '" data-id="' + bookIndex + '"' + '>' + bookTitle + '</p> <span class="remove" id="' + bookIndex + '" data-id="' + bookIndex + '"> remove </span>'  + '<br>');
        }
        
        // btn get
        $('.blog-link').on('click', (e)=> {
            var $this = $(e.currentTarget);
            var text = $this.attr('data-id');
            window.open('blogs.html?' + text);
        });
    })


    $.fn.displayBlog = function() {
        // fetching single blog data 
        var myString = window.location.href;
        var pathElements = myString.replace('blogs.html?', '', ).split('/');
        var blogId = pathElements[pathElements.length - 1];

        // fetching a single document (& realtime)
        const docRef = doc(db, 'books', blogId);
        onSnapshot(docRef, (doc) => {
            var blogTitle = (doc.data().title);
            var blogAuthor = (doc.data().author);
            var blogContent = (doc.data().content);

            $('.blog-title').text('Title: ' + blogTitle);
            $('.blog-author').text('Author: ' + blogAuthor);
            $('.blog-content').text(blogContent);
        })
    }

    $.fn.displayBlog();

    // adding docs
    const addBookForm = document.querySelector('.add')
    $('.add').on('submit', (e) => {
        e.preventDefault()

        addDoc(colRef, {
            title: addBookForm.title.value,
            author: addBookForm.author.value,
            content: addBookForm.content.value,
            createdAt: serverTimestamp()
        })
        .then(() => {
            addBookForm.reset()
        })

        $('.blog-list-main .blog-link').remove();
        $('.blog-list-main br').remove();
        $('.blog-list-main .remove').remove();
    })

    // deleting docs
    onSnapshot(colRef, (snapshot) => {
        $('.remove').on('click', (e) => {
            e.preventDefault();
            var $this = $(e.currentTarget);
            var text = $this.attr('data-id');

            const docRef = doc(db, 'books', text);
        
            deleteDoc(docRef)
            .then(() => {
                deleteBookForm.reset()
            });

            $('.blog-list-main .blog-link').remove();
            $('.blog-list-main br').remove();
            $('.blog-list-main .remove').remove();
            $('#' + text).remove();
        })
    })
});

// deleting docs
// const deleteBookForm = document.querySelector('.delete')
// deleteBookForm.addEventListener('submit', (e) => {
//   e.preventDefault()

//   const docRef = doc(db, 'books', deleteBookForm.id.value)

//   deleteDoc(docRef)
//     .then(() => {
//       deleteBookForm.reset()
//     })
// })

// fetching a single document (& realtime)
// const docRef = doc(db, 'books', 'gGu4P9x0ZHK9SspA1d9j')

// onSnapshot(docRef, (doc) => {
//   console.log(doc.data(), doc.id)
// })

// updating a document
// const updateForm = document.querySelector('.update')
// updateForm.addEventListener('submit', (e) => {
//   e.preventDefault()

//   let docRef = doc(db, 'books', updateForm.id.value)

//   updateDoc(docRef, {
//     title: 'updated title'
//   })
//   .then(() => {
//     updateForm.reset()
//   })
// })