import React, { Fragment, useEffect } from "react";
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import {connect } from 'react-redux';
import { deleteAccount, getCurrentProfile } from "../../actions/profile";
import Spinner from "../layout/Spinner";
import { DashboardActions } from './DashboardActions';
import Experience, { Experence } from './Experience';
import Education from "./Education";

const Dashbaord = ({getCurrentProfile, auth : { user }, profile : { profile, loading }, deleteAccount}) => {

    useEffect(() => {
        getCurrentProfile();
    }, []); 

    return loading && profile == null ? 
            (<Spinner />
                ) : (
                <Fragment>
                    <h1 className='large text-primary'>Dashboard</h1>
                    <p className='lead'>
                        <i className='fas fa-user'>Welcome {user && user.name}</i>
                    </p>
                    {
                        profile != null ? 
                            <Fragment> 
                                <DashboardActions></DashboardActions>
                                <Experience experience={profile.experience}></Experience>
                                <Education education={profile.education}></Education>
                                <div className='my-2'>
                                    <button className='btn btn-danger' onClick={() => deleteAccount()}>
                                        <i className='fas fa-user-minus'></i> Delete my account
                                    </button>
                                </div>
                            </Fragment> :
                            <Fragment> 
                                <p>You have not yet created profile, please add some info</p>
                                <Link to='/createprofile' className='btn btn-primary my-1'>Create Profile</Link>    
                            </Fragment> 
                    }
                </Fragment>  
            );
}

Dashbaord.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
    deleteAccount: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth,
    profile: state.profile
});

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(Dashbaord);