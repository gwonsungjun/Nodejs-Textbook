const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const {Good, Auction, User} = require('../models')
const {isLoggedIn, isNotLoggedIn} = require('./middlewares')

const router = express.Router()

router.use((req, res, next) => {
  res.locals.user = req.user
})

router.get('/', async (req, res, next) => {
  try {
    const goods = await Good.findAll({where: {soldId: null}})
    res.render('main', {
      title: 'NodeAuction',
      goods,
      loginError: req.flash('loginError')
    })
  } catch (error) {
    console.error(error)
    next(error)
  }
})

rotuer.get('/join', isNotLoggedIn, (req, res) => {
  res.render('join', {
    title: '회원가입 - NodeAuction',
    joinError: req.flash('joinError')
  })
})

router.get('/good', isLoggedIn, (req, res) => {
  res.render('good', {title: '상품 등록 - NodeAuction'})
})

fs.readdir('uploads', (error) => {
  if (error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다')
    fs.mkdirSync('uploads')
  }
})
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/')
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname)
      cb(null, path.basename(file.originalname, ext) + new Date().valueOf() + ext)
    }
  }),
  limits: {fileSize: 5 * 1024 * 1024}
})
