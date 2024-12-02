import express from 'express';
import { createContact, getContact, getAllContact, updateContact, deleteContact } from '../controllers/contactController.js';

const contactRoute = express.Router();

// Create a new contact message
contactRoute.post('/', createContact);

// Get all contact messages
contactRoute.get('/', getAllContact);

// Get a specific contact message by ID
contactRoute.get('/:id', getContact);

// Update a contact message by ID
contactRoute.put('/:id', updateContact);

// Delete a contact message by ID
contactRoute.delete('/:id', deleteContact);

export default contactRoute;
