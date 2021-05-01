import React from 'react';
import axios from 'axios';
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import Accordion from '@material-ui/core/Accordion';
import Typography from '@material-ui/core/Typography';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import { Form, Container, CardDeck, Card, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/billing.css';

import { CashStack } from 'react-bootstrap-icons';
import DescriptionIcon from '@material-ui/icons/Description';
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';

class Billing extends React.Component {

    static propTypes = {
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            billList: [],
            billListPaid: [],
            billListUnpaid: [],
            viewingPaid: false,
            display_bill_id: null,
            token: ""
        };
    }


    componentDidMount() {
        global.api.authenticate((user => {
            if (user === false) this.redirectPage();
            else this.setupPage(user);
        }).bind(this));
    }
    componentWillUnmount() {

    }

    redirectPage() {
        this.props.history.push('/home');
    }

    setupPage(user) {
        console.log('Billing: loading user ' + user.username);
        // TODO: load user data/info
        let query = new URLSearchParams(this.props.location.search);
        this.setState({
            token: user.token
        });
        var display_bill_id = null;
        if (query.has('id')) {
            display_bill_id = query.get('id').trim();
            this.setState({
                display_bill_id: display_bill_id
            });
        }
        this.getBills(user.token, ((resp, error = null) => {
            if (resp && resp.data) {
                var bill_list = [];
                for (var bill_id in resp.data) {
                    bill_list.push(resp.data[bill_id]);
                }
                bill_list = this.sortBillList(bill_list);
                var bill_list_paid = [];
                var bill_list_unpaid = [];
                for (var b in bill_list) {
                    // console.log(bill_list[b].bill_paid === true);
                    if (bill_list[b].bill_paid === true)
                        bill_list_paid.push(bill_list[b]);
                    else bill_list_unpaid.push(bill_list[b]);
                }
                bill_list_paid = this.sortBillList(bill_list_paid);
                bill_list_unpaid = this.sortBillList(bill_list_unpaid);
                this.setState({
                    billList: bill_list,
                    billListPaid: bill_list_paid,
                    billListUnpaid: bill_list_unpaid
                })
            } else {
                console.log(error);
            }
        }).bind(this));
    }

    sortBillList(bill_list, descending = true) {
        bill_list.sort((bill_a, bill_b) => {
            return (descending ? bill_b.timestamp - bill_a.timestamp : bill_a.timestamp - bill_b.timestamp);
        });
        return bill_list;
    }

    getBills(token, resolve) {
        axios.get(`${global.config.api_url}/billing`,
            { headers: { Authorization: `Bearer ${token}` } }
        ).then((response => {
            var resp_data = null;
            if (response && response.data)
                resp_data = response.data;
            // console.log(this.state);
            // console.log(resp_data);
            resolve(resp_data);
        }).bind(this)).catch((error => {
            if (error) {
                var resp_data = null;
                if (error.response && error.response.data)
                    resp_data = error.response.data;
                console.log(error, resp_data);
                // console.log("here");
                resolve(false, resp_data);
            }
        }).bind(this));
    }

    toggleViewPaid(event) {
        this.setState({
            viewingPaid: (event.target.checked === true)
        });
    }

    submitBill(bill_obj) {
        console.log('submitting bill', bill_obj);
    }

    render() {
        // console.log('this.state.viewingPaid: ' + this.state.viewingPaid);
        let activeModeText = this.state.viewingPaid ? 'paid' : 'unpaid';
        let activeModeTextUpper = (`${activeModeText[0]}`).toUpperCase() + activeModeText.substring(1);
        let activeBillList = this.state.viewingPaid ? this.state.billListPaid : this.state.billListUnpaid;
        // console.log(activeBillList);
        return (
            <div className="rightSide" style={{ marginTop: '100px', marginBottom: '45px' }} >
                <h1> Billing </h1>
                <br />
                <div className="billingMain">
                    <div style={{ width: '100%', height: '40px', textAlign: 'left', position: 'relative' }}>
                        <h3 style={{ paddingTop: '3px' }}> {activeModeTextUpper} Bills </h3>
                        <div style={{ position: 'absolute', top: '0', right: '0', height: '100%' }}>
                            <div style={{ float: 'right', height: '100%' }}>
                                <div style={{ height: '95%', width: 'auto', display: 'inline-table', float: 'left', marginRight: '4px', marginTop: '1px' }} className="block_wrap">
                                    <div className="block_content"><span style={{ marginTop: '4px' }}> View Paid </span></div>
                                </div>
                                <div style={{ display: 'inline-block', float: 'left' }}>
                                    <Switch color="default" defaultChecked={false} onChange={this.toggleViewPaid.bind(this)} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{ height: '7px' }}></div>
                    {
                        Object.keys(activeBillList).length > 0 ?
                            Object.values(activeBillList).map((bill, i) => {
                                var timestamp = bill.timestamp * 1000;
                                var timestamp_desc = global.util.date_desc(timestamp, false);
                                var timestamp_desc_full = global.util.date_desc(timestamp, true, true, true);
                                var p_id_exists = bill.hasOwnProperty('project_id') && bill.project_id && bill.project_id != null;
                                var hardware_usage_text = "";
                                for (var h in bill.hw_used) {
                                    if (bill.hw_used.hasOwnProperty(h)) {
                                        hardware_usage_text += `${bill.hw_used[h]} GB of ${h}, `;
                                    }
                                }
                                hardware_usage_text = hardware_usage_text.substring(0, hardware_usage_text.length - 2);
                                var amount_due_text = String(parseFloat(`0${bill.amount_due}`).toFixed(2));
                                var paid_timestamp = bill.paid_timestamp * 1000;
                                var paid_timestamp_desc_full = global.util.date_desc(paid_timestamp, true, true, true);
                                return (
                                    <Accordion key={i} style={{ borderTop: 'none' }} defaultExpanded={this.state.display_bill_id === bill.bill_id}>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />} >
                                            {/* <DescriptionIcon style={{ marginLeft: '0', marginRight: '15px', opacity: '0.75' }} /> */}
                                            <CashStack style={{ marginLeft: '5px', marginRight: '15px', opacity: '0.75', marginTop: '1.8px', height: '20px', width: '20px' }} />
                                            <Typography style={{ paddingTop: '2px', fontSize: '15px', letterSpacing: '0.35px' }}>
                                                {/* Hardware <span style={{ fontStyle: (p_id_exists ? 'italic' : 'italic') }}>{(p_id_exists ? `(${bill.project_id})` : '')}</span> –  */}
                                                Hardware – {timestamp_desc}
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails className="billItemDetails">
                                            <Typography style={{ textAlign: 'left', paddingLeft: '20px', paddingRight: '15px', letterSpacing: '0.45px', fontSize: '14px', marginTop: '-5px', paddingBottom: '5px' }}>
                                                <span style={{ fontStyle: 'none' }}><b> Bill ID:</b>&nbsp;<span>{bill.bill_id} </span><br /></span>
                                                <span><b> Creation Date:</b>&nbsp;<span>{timestamp_desc_full} </span><br /></span>
                                                <span><b> Hardware Usage:</b>&nbsp;<span>{hardware_usage_text} </span><br /></span>
                                                <span><b> Usage Type:</b>&nbsp;<span>{p_id_exists ? 'Project/Shared' : 'Personal'} </span><br /></span>
                                                <span style={{ display: (p_id_exists ? 'block' : 'none') }}><b> Source Project:</b>&nbsp;<span>{p_id_exists ? `${bill.project_id}` : 'N/A'} </span><br /></span>
                                                <span style={{ display: 'block', marginTop: '6px' }}><b> Bill Subtotal:</b>&nbsp;<span>${parseFloat(`0${bill.bill_subtotal}`).toFixed(2)} </span><br /></span>
                                                <span><b> Amount {(bill.bill_paid ? 'Paid' : 'Due')}:</b>&nbsp;<span>${amount_due_text} </span><br /></span>
                                                <span style={{ display: (bill.bill_paid ? 'block' : 'none') }}><b> Payment Date:</b>&nbsp;<span>{paid_timestamp_desc_full} </span><br /></span>
                                            </Typography>
                                            <div style={{ height: '79%', width: '190px', backgroundColor: '#111', position: 'absolute', top: '9px', right: '60px', borderRadius: '4px', border: '1px solid #f1f1f1', boxShadow: '0 3px 6px 0 rgb(0 0 0 / 12%)', color: 'white' }}>
                                                <div style={{ width: '100%', height: '100%' }} className="block_wrap">
                                                    <div className="block_content">
                                                        <span style={{ fontSize: '29px', opacity: '1', letterSpacing: '1.5px', display: 'block', marginTop: '15px', marginRight: '3px' }}>${amount_due_text}</span>
                                                        <Button disabled={bill.bill_paid} className="billSubmitButton" variant="contained" color="default" style={{ marginBottom: '22px' }} onClick={this.submitBill.bind(this, bill)}> {(!bill.bill_paid ? 'Pay Bill' : 'Paid Bill')} </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </AccordionDetails>
                                    </Accordion>
                                );
                            }) : (<div style={{ marginTop: '27px' }}><span>No {(activeModeText)} bills found.</span></div>)
                    }
                </div>
            </div>
        );
    }
}


export default withRouter(Billing);