const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const { check, validationResult } = require('express-validator');
const request = require('request');
const config = require('config');

// @route  GET api/profile/me
// @desc   Get current users profile
// @access Private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);
        if (!profile) {
            return res.status(400).json({ msg: 'No profile for this suer' });
        }
        res.send(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }

});

// @route  POST api/profile
// @desc   Save current users profile
// @access Public
router.post('/', [auth,
    check('status', 'Status is required')
        .not()
        .isEmpty(),
    check('skills', 'Skills is required')
        .not()
        .isEmpty()]
    , async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            company,
            website,
            location,
            bio,
            status,
            githubusername,
            skills,
            youtube,
            facebook,
            twitter,
            instagram,
            linkedin
        } = req.body;

        //build profile object
        const profileFields = {};
        profileFields.user = req.user.id;
        if (company) profileFields.company = company;
        if (website) profileFields.website = website;
        if (location) profileFields.location = location;
        if (bio) profileFields.bio = bio;
        if (githubusername) profileFields.githubusername = githubusername;
        if (status) profileFields.status = status;
        if (skills) {
            profileFields.skills = skills.toString().split(',').map(skill => skill.trim());
        }
        //build social object
        profileFields.social = {};
        if (youtube) profileFields.social.youtube = youtube;
        if (facebook) profileFields.social.facebook = facebook;
        if (twitter) profileFields.social.twitter = twitter;
        if (instagram) profileFields.social.instagram = instagram;
        if (linkedin) profileFields.social.linkedin = linkedin;

        console.log(profileFields, skills);
        try {
            let profile = await Profile.findOne({ user: req.user.id });
            if (profile) {
                profile = await Profile.findOneAndUpdate({ user: req.user.id },
                    { $set: profileFields },
                    { new: true });

                return res.json(profile);
            }

            profile = new Profile(profileFields);
            await profile.save();
            return res.json(profile);

        } catch (err) {
            console.error(500);
            res.status(500).send('Server error');
        }
    });

// @route  GET api/profile
// @desc   Get all profiles
// @access Public
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch (error) {
        console.error(500);
        res.status(500).send('Server error');
    }
});

// @route  GET api/profile/user/:user_id
// @desc   Get profile by user ID
// @access Public
router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name, avatar']);
        if (!profile) {
            return res.status(400).json({ msg: 'No profile for this suer' });
        }
        res.json(profile);

    } catch (error) {
        console.error(500);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'No profile for this suer' });
        }
        res.status(500).send('Server error');
    }
});

// @route  DELETE api/profile
// @desc   Delete profile, user, posts
// @access Private
router.delete('/', auth, async (req, res) => {
    try {
        //Remove Profile
        await Profile.findOneAndRemove({ user: req.user.id });
        //Remove User
        await User.findOneAndRemove({ _id: req.user.id });
        res.json({ msg: 'User removed' });
    } catch (error) {
        console.error(500);
        res.status(500).send('Server error');
    }
});

// @route  PUT api/profile/experience
// @desc   Add profile experience
// @access Private
router.put('/experience', [auth, [
    check('title', 'Title is required').not().isEmpty(),
    check('company', 'Comapny is required').not().isEmpty(),
    check('from', 'From Date is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body;

    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }

    try {
        const profile = await Profile.findOne({ user: req.user.id });
        profile.experience.unshift(newExp);
        await profile.save();
        res.send(profile);

    } catch (error) {
        console.error(500);
        res.status(500).send('Server error');
    }
});


// @route  DELETE api/profile/experience/:exp_id
// @desc   Delete profile experience
// @access Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        //get remove index
        const index = profile.experience.map(item => item.id).indexOf(req.params.exp_id);
        profile.experience.splice(index);
        profile.save();
        res.json({ msg: 'Experience removed' });
    } catch (error) {
        console.error(500);
        res.status(500).send('Server error');
    }
});

// @route  PUT api/profile/education
// @desc   Add profile education
// @access Private
router.put('/education', [auth, [
    check('school', 'School is required').not().isEmpty(),
    check('degree', 'Degree is required').not().isEmpty(),
    check('fieldofstudy', 'Field of Study is required').not().isEmpty(),
    check('from', 'From Date is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    } = req.body;

    const newEducation = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    }

    try {
        const profile = await Profile.findOne({ user: req.user.id });
        profile.education.unshift(newEducation);
        await profile.save();
        res.send(profile);

    } catch (error) {
        console.error(500);
        res.status(500).send('Server error');
    }
});


// @route  DELETE api/profile/education/:edu_id
// @desc   Delete profile education
// @access Private
router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        //get remove index
        const index = profile.education.map(item => item.id).indexOf(req.params.edu_id);
        profile.education.splice(index);
        profile.save();
        res.json({ msg: 'Education removed' });
    } catch (error) {
        console.error(500);
        res.status(500).send('Server error');
    }
});

// @route  GET api/profile/github/:username
// @desc   Get profile by user ID
// @access Public
router.get('/github/:username', async (req, res) => {
    try {
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&
            sort=created:asc&client_id=${config.get.githubclientid}&client_secret=${config.get.githubsecret}`,
            method: 'GET',
            headers: { 'user-agent': 'node.js' }
        };

        request(options, (error, response, body) => {
            if (error) console.error(error);

            if (response.statusCode !== 200) {
                return res.status(400).json({ msg: 'No github profile found' });
            }

            res.json(JSON.parse(body));
        });

    } catch (error) {
        console.error(500);
        res.status(500).send('Server error');
    }
});

module.exports = router;