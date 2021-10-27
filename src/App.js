import React, { useState, useEffect } from 'react'

import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

import { Card, Container, Row, Col, InputGroup, FormControl } from 'react-bootstrap'

function App() {
    const [posts, setPosts] = useState([])
    const [authors, setAuthors] = useState([])
    const [sortedPosts, setSortedPosts] = useState([])

    useEffect(() => {
        Promise.all([
            fetch('https://jsonplaceholder.typicode.com/posts'),
            fetch('https://jsonplaceholder.typicode.com/users'),
        ]).then(async ([responsePosts, responseAuthors]) => {
            const posts = await responsePosts.json()
            const authors = await responseAuthors.json()

            const postsWithAuthorName = posts.map((post) => {
                post.author = authors.find((author) => author.id === post.userId)
                return post
            })

            setPosts(postsWithAuthorName)
			setSortedPosts(postsWithAuthorName)
            setAuthors(
                authors.map((author) => {
                    return {
                        id: author.id,
                        name: author.name,
                    }
                })
            )
        })
    }, [])

    const inputHandler = (event) => {
        const authorInput = event.target.value
		if (authorInput === '') {
			setSortedPosts(posts)
		} else {
			const sortedPosts = []

			const sortedAuthors = authors.filter(i => {
				const [fName, lName] = i.name.split(' ')
				return fName.substr(0, authorInput.length).toUpperCase() === authorInput.toUpperCase() ||
				lName.substr(0, authorInput.length).toUpperCase() === authorInput.toUpperCase()
			})

			sortedAuthors.forEach(sortedAuthor => {
				sortedPosts.push(
					...posts.filter(post => post.userId === sortedAuthor.id)
				)
			})

			setSortedPosts(sortedPosts)
		}
    }

    const debounce = (func, wait) => {
        let timeout

        return function () {
            const context = this // undefined (arrow func)
            const args = arguments // event (from input)

            // call this func with context and args after delay
            const later = function () {
                timeout = null
                func.apply(context, args)
            }

            // if the function was called before the delay finished then clear the timeout and start it again
            clearTimeout(timeout)

            timeout = setTimeout(later, wait)
        }
    }

    return (
        <Container>
            <Row className="spacing">
                <InputGroup className="p-0">
                    <InputGroup.Text className="input-group-append" id="basic-addon1">
                        <i className="fa fa-search"></i>
                    </InputGroup.Text>
                    <FormControl
                        placeholder="Author"
                        aria-label="Author"
                        aria-describedby="basic-addon1"
                        onChange={debounce(inputHandler, 500)}
                    />
                </InputGroup>
            </Row>
            <Row>
                {sortedPosts.map((post) => (
                    <Col key={post.id} className="spacing" lg={4} sm={6} xs={12}>
                        <Card>
                            <Card.Body>
                                <Card.Title className="blue">{post.title}</Card.Title>
                                <Card.Text>{post.body}</Card.Text>
                            </Card.Body>
                            <Card.Footer>
                                <small className="text-muted">{post.author.name}</small>
                            </Card.Footer>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    )
}

export default App
