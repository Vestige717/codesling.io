import mongoose from 'mongoose';
import bluebird from 'bluebird';

import Sling from '../db/models/sling';
import log from '../lib/log';
import generateSlingId from '../lib/generateSlingId';

mongoose.Promise = bluebird;

const existsInDatabase = async (slingId) => {
  const sling = await Sling.findOne({ slingId });
  return !!sling;
};

export const fetchNewSlingId = async (req, res) => {
  try {
    let slingId = generateSlingId();
    // regenerate slingId if it already exists
    while (await existsInDatabase(slingId)) {
      slingId = generateSlingId();
    }
    // save sling in db
    let password = '';
    const newSling = new Sling({ slingId, password });
    await newSling.save();
    log('sling successfully created');
    return res.status(200).json({
      success: true,
      slingId,
    });
  } catch (e) {
    log('error fetching newSlingId', e);
    return res.status(400).json({
      success: false,
      e,
    });
  }
};

export const forceNewSlingId = async (req, res) => {
  //console.log(req)
  let roomExists = false;
  console.log(req.body.roomId + ' forceNewSlingId invoked!!!!!!!!!!!');
  console.log(req.body.isPassword + ' this is the password status')
  console.log('password ', req.body.password)

  try {
    
    let slingId = req.body.roomId;
    let password = req.body.isPassword ? req.body.password : '';
    // regenerate slingId if it already exists
    while (await existsInDatabase(slingId)) {
      slingId = generateSlingId();
      roomExists = true;
    }
    // save sling in db
    const newSling = new Sling({ slingId, password });
    console.log('this is the new sling ',newSling)
    console.log()
    await newSling.save();
    log('sling successfully created');
    return res.status(200).json({
      success: true,
      slingId,
      password,
      roomExists,
    });
  } catch (e) {
    log('error fetching newSlingId', e);
    return res.status(400).json({
      success: false,
      e,
    });
  }
};

export const slingFetch = async (req, res) => {
  try {
    const sling = await Sling.findOne({ slingId: req.params.slingId });
    log('sling successfully fetched');
    console.log('sling', sling);
    return res.status(200).json({
      success: true,
      sling,
    });
  } catch (e) {
    log('error in slingFetch ', e);
    return res.status(400).json({
      success: false,
      e,
    });
  }
};

export const slingPost = async (req, res) => {
  try {
    let password = '';
    console.log('this is slingPost req.body ===',req.body);
    const newSling = new Sling(req.body, '');
    await newSling.save();
    log('sling successfully created');
    return res.status(200).json({
      success: true,
      newSling,
    });
  } catch (e) {
    log('error in slingPost ', e);
    return res.status(400).json({
      success: false,
      e,
    });
  }
};

export const slingUpdate = async (req, res) => {
  try {
    const sling = await Sling.findById(req.params.id);
    sling.text = req.body.text;
    await sling.save();
    log('sling successfully updated');
    return res.status(200).json({
      success: true,
      sling,
    });
  } catch (e) {
    log('error in slingUpdate ', e);
    return res.status(400).json({
      success: false,
      e,
    });
  }
};

export const slingDelete = async (req, res) => {
  try {
    const slingDeleted = await Sling.findByIdAndRemove(req.params.id);
    log('sling successfully deleted');
    return res.status(200).json({
      success: true,
      slingDeleted,
    });
  } catch (e) {
    log('error in slingDelete ', e);
    return res.status(400).json({
      success: false,
      e,
    });
  }
};

