// Core
import React, { Component } from 'react';
import { boolean } from 'prop-types';

// Instruments
import Styles from './styles.m.css';

export default class Spinner extends Component {
    /*static propTypes = {
        isSpinning: boolean.isRequired,
    };*/

    render () {
        const { isSpinning } = this.props;

        return isSpinning
            ? <div className = { Styles.spinner } />
            : null;
    }
}
