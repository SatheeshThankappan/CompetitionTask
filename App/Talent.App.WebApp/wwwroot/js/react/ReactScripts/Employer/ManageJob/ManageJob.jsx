import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { Cards } from './Cards.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { Pagination, Icon, Dropdown, Checkbox, Accordion, Form, Segment, Header, Grid } from 'semantic-ui-react';
const LEFT_PAGE = 'LEFT';
const RIGHT_PAGE = 'RIGHT';
const style = {
    top: 20 + '%',
    bottom: 'auto',
    position: 'absolute',
    zIndex: 9000,
    left: 20 + '%',
}
const style1 = {
    paddingTop: 20,
    paddingBottom: 50,
    marginLeft:15,
    
}
const style2 = {
    top: 55 + '%',
    bottom: 'auto',
    position: 'absolute',
    zIndex: 9000,
    right: 30 + '%',
}
export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        let loader = loaderData
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");
        //console.log(loader)
        this.state = {


            loadJobs: [],
            loaderData: loader,
            activePage: 1,
            sortBy: {
                date: "desc"
            },
            filter: {
                showActive: true,
                showClosed: false,
                showDraft: true,
                showExpired: true,
                showUnexpired: true
            },
            totalPages: 1,
            activeIndex:""
        }
        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
        this.loadNewData = this.loadNewData.bind(this);
        this.FilterJobs = this.FilterJobs.bind(this);
        this.handleItemClick = this.handleItemClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handlePaginationChange = this.handlePaginationChange.bind(this);

        //your functions go here
    };
    handlePaginationChange(e, { activePage }) {
        this.loadNewData({activePage: activePage})
    }
    handleChange(e, { name, value }) {
        this.state.sortBy[name] = value;
        this.loadNewData({ sortBy: this.state.sortBy })
    }
   
    handleItemClick(e, titles) {
        const { index } = titles
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index
        this.setState({ activeIndex: newIndex })
    }
    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = false;
        this.loadData(()=>
            this.setState({ loaderData })
            )
    }
    
    componentDidMount() {
        this.init();
        this.loadData();
    };
    //loadData1(callback) {
    //    var link = 'http://localhost:51689/listing/listing/getSortedEmployerJobs';
    //    var cookies = Cookies.get('talentAuthToken');
        // your ajax call and other logic goes here
       

    //}

    loadData(callback) {
        var link = 'http://localhost:51689/listing/listing/getSortedEmployerJobs';

        var cookies = Cookies.get('talentAuthToken');
        // your ajax call and other logic goes here
        $.ajax({           
        
            url: link,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            data: {
                activePage: this.state.activePage,
                sortbyDate: this.state.sortbyDate,
                showActive: this.state.filter.showActive,
                showClosed: this.state.filter.showClosed, showDraft: this.state.filter.showDraft,
                showExpired: this.state.filter.showExpired, showUnexpired: this.state.filter.showUnexpired
            },
            contentType: "application/json",
            dataType: "json",
            success: function (data) {
                this.setState({ loadJobs: data.myJobs, totalPages: Math.ceil(data.totalCount / 6) }, callback);
             
               console.log(data);
            }.bind(this),  
           
        });
        
    }
    FilterJobs(e, { checked, name }) {
        this.state.filter[name] = checked;
        this.setState({ filter: this.state.filter })


    }

    loadNewData(data) {
        var loader = this.state.loaderData;
        loader.isLoading = true;
        data[loaderData] = loader;
        this.setState(data, () => {
            this.loadData(() => {
                loader.isLoading = false;
                this.setState({
                    loadData: loader
                })
            })
        });
    }
   
    
    render() {
        var data = undefined;
      
       
        if (this.state.loadJobs.length > 0) {
            data = this.state.loadJobs.map(x => {
                return (
                    
                                <Cards key={x.id} data={x} reloadData={this.loadData} />);
                
            })
            console.log(data[1]);
            
        }
        
        const options = [
            {
                key: 'desc',
                text: 'Newest first',
                value: 'desc',
                content: 'Newest first',
            },
            {
                key: 'asc',
                text: 'Oldest first',
                value: 'asc',
                content: 'Oldest first',
            }
        ];

        const { activeIndex } = this.state;
        return (
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
                <div className="ui container">
                    <Header as='h3' >List of Jobs</Header>
                    <div className="ui grid">
                        <div className="row">
                            <div className="column">
                            
                
                
                <span>
                
                    <Icon name='filter' />
                    {"Filter :"}
                       
                    <Dropdown
                        inline simple text="Coose Filter"
                            
                           
                        >

                        <Dropdown.Menu>

                            <Dropdown.Item >
                                <Accordion>
                                    <Accordion.Title active={activeIndex === 1} index={1} onClick={this.handleItemClick} content='Status'>
                                        <Icon name='dropdown' />
                                    </Accordion.Title>
                                    <Accordion.Content active={activeIndex === 1} >
                                            <Form>
                                                <Form.Group grouped>
                                                <Form.Checkbox label={'Active Jobs'}
                                                    name="showActive" onChange={this.FilterJobs} checked={this.state.filter.showActive} />
                                                <Form.Checkbox label={'Closed Jobs'}
                                                    name="showClosed" onChange={this.FilterJobs} checked={this.state.filter.showClosed} />
                                                <Form.Checkbox label={'Draft'}
                                                    name="showDraft" onChange={this.FilterJobs} checked={this.state.filter.showDraft} />

                                                    </Form.Group>
                                                </Form>
                                        </Accordion.Content>
                                    </Accordion>
                                </Dropdown.Item>
                           
                                <Dropdown.Item >
                                <Accordion>
                                    <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleItemClick} content="ExpiryDate">
                                        <Icon name='dropdown' />
                                    </Accordion.Title>
                                    <Accordion.Content active={activeIndex === 0} >
                                        <Form>
                                            <Form.Group grouped>
                                                <Form.Checkbox label={'Expired Jobs'}
                                                    name="showExpired" onChange={this.FilterJobs} checked={this.state.filter.showExpired} />
                                                <Form.Checkbox label={'Unexpired Jobs'}
                                                    name="showUnexpired" onChange={this.FilterJobs} checked={this.state.filter.showUnexpired} />

                                            </Form.Group>
                                        </Form>
                                        </Accordion.Content>
                                    </Accordion>
                            </Dropdown.Item>
                                <button className="ui teal small but"
                                    style={{ width: "100%", borderRadius: "0" }}
                                        
                                    onClick={() => this.loadNewData({ activePage: 1 })} >
                                            
                                                             
                                
                                        <i className="filter icon" />
                                
                                                Load
         
                                                    </button>
                            


                           

                            </Dropdown.Menu>
                    </Dropdown>
                </span>
                <span>

                    <i className="calendar icon" />                   
                    
                    {"Sort by date: "}
                    <Dropdown inline simple options={options}
                        name="date"
                        onChange={this.handleChange}
                       
                            value={this.state.sortBy.date}
                        />

                                </span>
                                <div >
                                   -
                                </div>
                                <div className="ui three cards" >
                                    {
                                        // ui for the cards nbkjhjhu
                        
                                        data != undefined ?
                                            data :
                                            <React.Fragment>
                                                <p style={style1}>no jobs found</p>
                                            </React.Fragment>

                       
                            
                                }

                                </div>
                            </div>
                        </div>
                       
             
                <div className="Centered row">

                    <Pagination
                        ellipsisItem={{ content: <Icon name='ellipsis horizontal' />, icon: true }}
                        firstItem={{ content: <Icon name='angle double left' />, icon: true }}
                        lastItem={{ content: <Icon name='angle double right' />, icon: true }}
                        prevItem={{ content: <Icon name='angle left' />, icon: true }}
                        nextItem={{ content: <Icon name='angle right' />, icon: true }}
                        totalPages={this.state.totalPages}
                        
                        onPageChange={this.handlePaginationChange}
                    />

                </div> 

                        <div className="row">
                        </div>
                    </div>
                </div>
            </BodyWrapper>
        )
      

    }
}