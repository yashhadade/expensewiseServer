import JwtPassport from "passport-jwt";

import { userModel } from "../DBModel/userModal/index.js";
import { organizationModel } from "../DBModel/organizationModal/index.js";

const JWTStrategy = JwtPassport.Strategy;
const ExtractJwt = JwtPassport.ExtractJwt;

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: "newProject",
};

export default (passport) => {

    passport.use(
        new JWTStrategy(options, async (jwt__payload, done) => {
            try {
                const doesUserExist = await userModel.findById(jwt__payload.user) || await organizationModel.findById(jwt__payload.org);

                if (!doesUserExist) return done(null, false);

                return done(null, doesUserExist);
            } catch (error) {
                throw new Error(error);
            }
        })
    );
};