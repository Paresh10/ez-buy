const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const Product = require('../models/product')
const User = require('../models/user')
const Checkout = require('../models/user')
const requireAuth = require('../lib/requireAuth')

// Get show route for checkout
router.get('/show', async (req, res, next) => {
    try {
        const foundUser = await User.findById(req.session.userId).populate('products')

        res.render('checkouts/show.ejs', {
            user: foundUser,
            userId: req.session.userId
        })
    } catch (err) {
        next(err)
    }
})


// display all the product of the current user
router.post('/select/:id', requireAuth, async (req, res, next) => {
    try {
        const findUser = await User.findById(req.session.userId)
        const findAllSelectedProducts = await Product.findById(req.params.id) //.populate('user')

        findUser.products.push(findAllSelectedProducts)

        await findUser.save()

        res.redirect('/products')
    } catch (err) {
        next(err)
    }
})

// Get route for Checkout thank you page
router.get('/thankyou', async (req, res, next) => {
    try {
        res.render('checkouts/thankyou.ejs', {
            userId: req.session.userId
        })

    } catch (err) {
        next(err)
    }
})

// Post route for thankyou when user complets the purchase
router.post('/thankyou', async (req, res, next) => {
    try {
        const foundUser = await User.findById(req.session.userId).populate('products')

        foundUser.products = []

        await foundUser.save()
        res.redirect('/checkouts/thankyou')
    } catch (err) {
        next(err)
    }
})


// Delete route for user tto be able to delete products
router.delete('/delete/:id', async (req, res, next) => {
    try {
        const foundUser = await User.findById(req.session.userId).populate('products')

        for (let i = 0; i < foundUser.products.length; i++) {
            if (foundUser.products[i].id == req.params.id) {

                foundUser.products.splice(i, 1)
            }
        }

        await foundUser.save()

        res.redirect('/checkouts/show')
    } catch (err) {
        next(err)
    }
})

module.exports = router
