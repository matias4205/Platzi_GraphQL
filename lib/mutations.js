'use strict'

const connectDb = require('./db');
const { ObjectId } = require('mongodb');
const errorHandler = require('./errorHandler');

module.exports = {
    createCourse: async(root, { input }) => {
        const defaults = {
            description: '',
            topic: ''
        }
        
        const newCourse = { ...defaults, ...input }
        let db;
        let course;

        try {
            db = await connectDb();
            course = await db.collection('courses').insertOne(newCourse);
            newCourse._id = course.insertedId;
        } catch (err) {
            errorHandler(err);
        }

        return newCourse;
    },

    createPerson: async(root, { input }) => {
        let db;
        let student;

        try {
            db = await connectDb();
            student = await db.collection('students').insertOne(input);
            input._id = student.insertedId;
        } catch (err) {
            errorHandler(err);
        }

        return input;
    },

    editCourse: async(root, { id, input }) => {
        let db;
        let course;

        try {
            db = await connectDb();
            await db.collection('courses').updateOne({ _id: ObjectId(id)}, {
                $set: input
            });
            course = await db.collection('courses').findOne({ _id: ObjectId(id) });
        } catch (err) {
            errorHandler(err);
        }

        return course;
    },

    editPerson: async(root, { id, input }) => {
        let db;
        let student;

        try {
            db = await connectDb();
            await db.collection('students').updateOne({ _id: ObjectId(id)}, {
                $set: input
            });
            student = await db.collection('students').findOne({ _id: ObjectId(id) });
        } catch (err) {
            errorHandler(err);
        }

        return student;
    },

    deletePerson: async(root, { id }) => {
        let db;

        try {
            db = await connectDb();
            await db.collection('students').remove({ _id: ObjectId(id) });
        }catch(err){
            errorHandler(err);
        }

        return id;
    },

    addPeople: async(root, { courseId, personId }) => {
        let db
        let person
        let course

        try {
            db = await connectDb();
            course = await db.collection('courses').findOne({ _id: ObjectId(courseId) });
            person = await db.collection('students').findOne({ _id: ObjectId(personId) });

            if(!course || !person) throw new Error('La persona o el curso no existe!');
            
            await db.collection('courses').updateOne({
                _id: ObjectId(courseId)
            },
            {
                $addToSet: {
                    people: ObjectId(personId)
                }
            });
        } catch (err) { //5d9eb78cb53ae83f7c03038c
            errorHandler(err);
        }

        return course;
    }
};
