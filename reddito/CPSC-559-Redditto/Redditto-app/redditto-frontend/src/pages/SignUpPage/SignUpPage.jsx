import {
  Flex,
  VStack,
  Text,
  SimpleGrid,
  Input,
  Button,
  List,
  ListIcon,
  ListItem,
  Box,
  useToast,
} from "@chakra-ui/react";
import { CheckCircleIcon, SmallCloseIcon } from "@chakra-ui/icons";
import { Header } from "../../components/Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUserContext } from "../../context/UserContext";


//user input info
let userData = {
  first_name: "",
  last_name: "",
  username: "",
  major: "",
  password: "",
};

//user input checks
let fisrtNameChecks = {
  hasDigit: false,
  hasSpecialChar: false,
};

let lastNameChecks = {
  hasDigit: false,
  hasSpecialChar: false,
};

let signUpBooleans = {
  canSubmit: false,
  isSigningUp: false
}

const InputTitleText = (props) => {
  const title = props.title;
  return (
    <Text fontSize={{ base: 20, md: 25 }} fontStyle={"Roboto"}>
      {title}
    </Text>
  );
};

export const SignUpPageContent = () => {
  //to set user info
  const {acknowledgeSignIn, setUserNameForContext, setUserMajorForContext} = useUserContext();

  //for page navigation
  const navigate = useNavigate();

  const [firstNameHasDigit, setFirstNameHasDigitBoolean] = useState(false)
  const [firstNameHasSpecialChar, setFirstNameHasSpecialCharBoolean] = useState(false)
  function handleFirstNameChange(e) {
    let inputValue = e.target.value;

    fisrtNameChecks.hasDigit = /[0-9]+/.test(inputValue);
    setFirstNameHasDigitBoolean(fisrtNameChecks.hasDigit)

    fisrtNameChecks.hasSpecialChar = /[^A-Za-z0-9]+/.test(inputValue);
    setFirstNameHasSpecialCharBoolean(fisrtNameChecks.hasSpecialChar)

    if (!fisrtNameChecks.hasDigit && !fisrtNameChecks.hasSpecialChar) {
      userData.first_name = inputValue;
      console.log("This is user's first name: " + userData.first_name);
    }
  }

  const [lastNameHasDigit, setLastNameHasDigitBoolean] = useState(false)
  const [lastNameHasSpecialChar, setLastNameHasSpecialCharBoolean] = useState(false)
  function handleLastNameChange(e) {
    let inputValue = e.target.value;

    lastNameChecks.hasDigit = /[0-9]+/.test(inputValue);
    setLastNameHasDigitBoolean(lastNameChecks.hasDigit)

    lastNameChecks.hasSpecialChar = /[^A-Za-z0-9]+/.test(inputValue);
    setLastNameHasSpecialCharBoolean(lastNameChecks.hasSpecialChar)

    if (!lastNameChecks.hasDigit && !lastNameChecks.hasSpecialChar) {
      userData.last_name = inputValue;
    }
    console.log("This is user's last name: " + userData.last_name);
  }
  function handleUsernameChange(e) {
    let inputValue = e.target.value;
    userData.username = inputValue;
    console.log("This is the user's username: " + userData.username);
  }
  function handleMajorChange(e) {
    let inputValue = e.target.value;
    userData.major = inputValue;
    console.log("This is user major: " + userData.major);
  }

  //for password check
  const minLength = 6;
  const strengthChecks = {
    length: 0,
    hasUpperCase: false,
    hasDigit: false,
    hasSpecialChar: false,
  };
  const [hasDigit, setDigitBoolean] = useState(false)
  const [hasUpperCase, setUpperCaseBoolean] = useState(false)
  const [hasLength, setLengthBoolean] = useState(false)
  const [hasSpecialChar, setSpecialCharBoolean] = useState(false)
  function handlePasswordChange(e) {
    //password value for user input
    let passwordValue = e.target.value;
    //for password checks
    strengthChecks.length = passwordValue.length >= minLength ? true : false;
    setLengthBoolean(strengthChecks.length)

    strengthChecks.hasUpperCase = /[A-Z]+/.test(passwordValue);
    setUpperCaseBoolean(strengthChecks.hasUpperCase)

    // strengthChecks.hasLowerCase = /[a-z]+/.test(passwordValue);
    // setLowerCaseBoolean(strengthChecks.hasLowerCase)

    strengthChecks.hasDigit = /[0-9]+/.test(passwordValue);
    setDigitBoolean(strengthChecks.hasDigit)

    strengthChecks.hasSpecialChar = /[^A-Za-z0-9]+/.test(passwordValue);
    setSpecialCharBoolean(strengthChecks.hasSpecialChar)

    //let verifiedList = Object.values(strengthChecks).filter((value) => value);
    // var strength =
    //   verifiedList.length == 5
    //     ? "Strong"
    //     : verifiedList.length >= 2
    //     ? "Medium"
    //     : "Weak";
    userData.password = passwordValue;
    // setProgress(`${(verifiedList.length / 5) * 100}%`);
    console.log("This is the password as the end:" + userData.password);
    //console.log("verifiedList: ", `${(verifiedList.length / 5) * 100}%`);
  }

  //docker
  const url = `http://redditto.lober.ca:${process.env.REACT_APP_BACKEND_PORT}/user`;

  //for error notification
  const toast = useToast({
    containerStyle: {
      width: 500,
      maxWidth: "80%",
      minWidth: 300
    },
  })
  
  //error handling
  function handleInputErrorChecks(){
    const id = "toast-id"
    if((firstNameHasDigit && !toast.isActive(id)) ||
      (lastNameHasDigit && !toast.isActive(id))
    ){
      signUpBooleans.canSubmit = false
      return(
        toast({
          id,
          title: 'Cannot create account.',
          description: "First and/or Last Name CANNOT have a DIGIT",
          status: 'error',
          duration: 9000,
          isClosable: true,
          position:'top'
        })   
      )    
    }
    
    if((firstNameHasSpecialChar && !toast.isActive(id)) ||
      (lastNameHasSpecialChar && !toast.isActive(id))
    ){
      signUpBooleans.canSubmit = false
      return(
        toast({
          id,
          title: 'Cannot create account.',
          description: "First and/or Last Name CANNOT have a SPECIAL CHARACTER",
          status: 'error',
          duration: 9000,
          isClosable: true,
          position:'top'
        })
      )
    }

    if(!firstNameHasDigit && !firstNameHasSpecialChar &&
      !lastNameHasDigit && !lastNameHasSpecialChar
    ){
      if(!signUpBooleans.canSubmit){
        signUpBooleans.canSubmit = true
      }

      return(
        toast({
          id,
          title: 'Creating your account!',
          description: "It may take a few seconds for us to create your homepage!",
          status: 'success',
          duration: 9000,
          isClosable: true,
          position:'top'
        })
      )
    }
    console.log("Finished checking errors")
    console.log("This is user data when checking for errors: " + JSON.stringify(userData))
  }

  
  //sends user information
  async function handleSignUpButtonClick() {
    if(signUpBooleans.canSubmit){
      setUserNameForContext(userData.username)
      setUserMajorForContext(userData.major)
      localStorage.setItem('usernameFromDbLocalStorage', userData.username)
      localStorage.setItem('userMajorFromDbLocalStorage', userData.major)
      acknowledgeSignIn(true) //tells everyone else, the user has signed in
      localStorage.setItem('isUserSignedInLocalStorage', true)
      console.log("This is userData when submitting: " + JSON.stringify(userData))
      console.log("Going to submit")
      try {
        await axios
          .post(url, userData, {
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then((response) => { 
            if (response.status == 201) {
              toast.closeAll();
              navigate("/home");
            }           
          });
      } catch (err) {
        if (err.response) {
          // The client was given an error response (5xx, 4xx)
          console.log(err.response.data);
          console.log(err.response.status);
          console.log(err.response.headers);
        } else if (err.request) {
          // The client never received a response, and the request was never left
        } else {
          // Anything else
        }
      }
    }else if(!signUpBooleans.canSubmit ){
      console.log("NOT going to submit")
    }
  }

  return (
    <VStack w="100%" justify={"center"} spacing={10}>
      <Text
        bg={"#5B73FF  "}
        bgClip={"text"}
        fontSize={{ base: 30, md: 40 }}
        fontWeight={"bold"}
      >
        Create Account
      </Text>
      <SimpleGrid w="100%" columns={{ base: 1, md: 2 }} spacing={10}>
        <Flex direction="column">
        <Flex>
          <InputTitleText title="First Name" fontSize={10}/><span style={{color:"#F55151", fontWeight:"bold" ,fontSize:20}}>*</span>
        </Flex>
          
          <Input
            isRequired
            bg="#191826"
            //variant='filled'
            color={"white"}
            placeholder="First Name"
            //borderColor={"#9f78ff"}
            focusBorderColor="#488EC4"
            size="lg"
            onChange={handleFirstNameChange}
          />
        </Flex>

        <Flex direction="column">
          <Flex>
            <InputTitleText title="Last Name" /><span style={{color:"#F55151", fontWeight:"bold" ,fontSize:20}}>*</span>
          </Flex>
          <Input
            isRequired
            bg="#191826"
            color={"white"}
            placeholder="Last Name"
            focusBorderColor="#488EC4"
            size="lg"
            width='auto'
            onChange={handleLastNameChange}
          />
        </Flex>

        <Flex direction="column">
          
          <Flex>
            <InputTitleText title="Username" /><span style={{color:"#F55151", fontWeight:"bold" ,fontSize:20}}>*</span>
          </Flex>
          <Input
            isRequired
            bg="#191826"
            color={"white"}
            placeholder="Username"
            focusBorderColor="#488EC4"
            size="lg"
            width='auto'
            onChange={handleUsernameChange}
          />
        </Flex>

        <Flex direction="column">
          
          <Flex>
          <InputTitleText title="Major" /><span style={{color:"#F55151", fontWeight:"bold" ,fontSize:20}}>*</span>
          </Flex>
          <Input
            isRequired
            bg="#191826"
            color={"white"}
            placeholder="Major"
            focusBorderColor="#488EC4"
            size="lg"
            width='auto'
            onChange={handleMajorChange}
          />
        </Flex>

        <Flex direction="column">
          
          <Flex>
            <InputTitleText title="Password" /> <span style={{color:"#F55151", fontWeight:"bold" ,fontSize:20}}>*</span>
          </Flex>
          <Input
            isRequired
            bg="#191826"
            color={"white"}
            placeholder="Password"
            focusBorderColor="#488EC4"
            size="lg"
            width='auto'
            onChange={handlePasswordChange}
            
          />

          <Flex direction="column" paddingTop={4}>
            <List spacing={2} fontSize={16} fontWeight={"semibold"}>
              <ListItem fontSize={20}>
                Password must contain each of the following:
              </ListItem>
              <ListItem>
                <ListIcon as={hasUpperCase ? CheckCircleIcon : SmallCloseIcon} color={hasUpperCase ? 'green.500' : 'red.500'} />
                1 Capital letter
              </ListItem>

              <ListItem>
                <ListIcon as={hasDigit ? CheckCircleIcon : SmallCloseIcon} color={hasDigit ? 'green.500' : 'red.500'} />
                1 number
              </ListItem>

              <ListItem>
                <ListIcon as={hasSpecialChar ? CheckCircleIcon : SmallCloseIcon} color={hasSpecialChar ? 'green.500' : 'red.500'} />
                1 symbol
              </ListItem>

              <ListItem>
                <ListIcon as={hasLength ? CheckCircleIcon : SmallCloseIcon} color={hasLength ? 'green.500' : 'red.500'} />
                6 characters or more
              </ListItem>
            </List>
          </Flex>
        </Flex>
      </SimpleGrid>
      <Button
        //rounded={"2xl"}
        bg="#4736B0"
        fontSize={20}
        width={40}
        p={4}
        size={"lg"}
        onClick={(e)=>{
          handleInputErrorChecks()
          if(signUpBooleans.canSubmit){
            e.currentTarget.disabled = true;
          }          
          handleSignUpButtonClick()
        }}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export const SignUpPage = () => {
  return <Header pageContent={<SignUpPageContent />} />;
};
