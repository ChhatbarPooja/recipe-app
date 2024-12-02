import { Contact } from '../models/contactModel.js';

// Create a new contact message
export const createContact = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        const newContact = new Contact({ name, email, subject, message });
        await newContact.save();
        res.status(201).json(newContact);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all contact messages
export const getAllContact = async (req, res) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const pageIndex = parseInt(req.query.pageIndex) || 1;
        const search = req.query.search ? req.query.search.trim() : '';

        let searchList = {};
        if (search) {
            searchList = {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                    { subject: { $regex: search, $options: 'i' } },
                    { message: { $regex: search, $options: 'i' } }
                ]

            }
        }
        const skip = (pageIndex - 1) * pageSize;
        const contacts = await Contact.find(searchList)
            .skip(skip)
            .limit(pageSize);
        const totalContacts = await Contact.countDocuments(searchList)

        res.status(200).json({
            contacts,
            totalContacts,
            pageIndex,
            pageSize,
            totalPages: Math.ceil(totalContacts / pageSize)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a specific contact message by ID
export const getContact = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) return res.status(404).json({ message: 'Contact not found' });
        res.status(200).json(contact);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a contact message by ID
export const updateContact = async (req, res) => {
    try {
        const updatedContact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedContact) return res.status(404).json({ message: 'Contact not found' });
        res.status(200).json(updatedContact);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a contact message by ID
export const deleteContact = async (req, res) => {
    try {
        const deletedContact = await Contact.findByIdAndDelete(req.params.id);
        if (!deletedContact) return res.status(404).json({ message: 'Contact not found' });
        res.status(200).json({ message: 'Contact deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
