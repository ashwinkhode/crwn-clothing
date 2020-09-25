import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import './App.css';
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import HomePage from './pages/homepage/homepage.component.jsx';
import ShopPage from './pages/shop/shop.component'
import SignInAndSignUpPage from './pages/sign-in-and-sign-up/sign-in-and-sign-up.component'
import Header from './components/header/header.component'
import CheckoutPage from './pages/checkout/checkout.component'

import { auth, createUserProfileDocument } from './firebase/firebase.utils'
import { setCurrentUser } from './redux/user/user.actions'
import { selectCurrentUser } from './redux/user/user.selectors'

class App extends React.Component {
    

    unsubscribeFromAuth = null

    componentDidMount() {

      const { setCurrentUser } = this.props;

        this.unsubscribeFromAuth = auth.onAuthStateChanged(async userAuth => {
          if (userAuth) {
            const userRef = await createUserProfileDocument(userAuth);
            
            try { 
            userRef.onSnapshot(snapShot => {
              setCurrentUser({
                  id: snapShot.id,
                  ...snapShot.data()
                })
        
    
            });
            }
            catch(error) {
                console.log('auth error', error)
            }
          }
    
          setCurrentUser( userAuth );
        });
      }
    

    componentWillUnmount() {
        this.unsubscribeFromAuth();
    }

    render() {
        return (
            <div>
                <BrowserRouter>
                    <Header />
                    <Switch>
                        <Route exact path='/' component={HomePage} />
                        <Route path='/shop' component={ShopPage} />
                        <Route path='/checkout' component={CheckoutPage} />
                        <Route path='/signin' render={() => this.props.currentUser ? (<Redirect to='/' />) : ( <SignInAndSignUpPage /> )} />
                    </Switch>
                </BrowserRouter>
            </div>
        );
    }
}

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser
})

const mapDispatchToProps = dispatch => ({
  setCurrentUser: user => dispatch(setCurrentUser(user))
})

export default connect( mapStateToProps, mapDispatchToProps )(App);
