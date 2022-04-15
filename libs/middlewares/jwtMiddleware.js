'use strict';
import { verify } from 'jsonwebtoken';
import Constants from '../config/constants';
import User from '../models/User';

export default function (expectedroles) {
  return async (req, res, next) => {
    if (!req.headers.authorization) {
      return res.status(403).json({ responseCode: 403, success: false });
    }
    const headerParts = req.headers.authorization.split(' ');
    const prefix = headerParts[0];
    const token = headerParts[1];
    if (prefix !== 'Bearer' || !token) {
      return res.status(403).json({ responseCode: 403, success: false });
    }
    let decoded = '';
    try {
      decoded = verify(token, process.env.secret);
    } catch (error) {
      return res.status(403).json({ responseCode: 403, success: false });
    }
    const role = decoded.role;
    const id = decoded.id;
    if (!role) {
      return res.status(403).json({ responseCode: 403, success: false });
    }
    if (role && expectedroles.indexOf(role) !== -1) {
      if (role == Constants.roles.user) {
        const user = await User.findOne({ _id: id }).select(Constants.userSelect);
        if (!user) {
          return res.status(403).json({ responseCode: 403, success: false });
        }
        req.user = user;
      }
      req.id = id;
      req.role = role;
    } else {
      return res.status(403).json({ responseCode: 403, success: false });
    }
    next();
  };
}
