import { 
  Image,
  Box,
  Flex,
  VStack,
  HStack,
  Heading,
  Input,
  Button,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import axios from "axios";
//import "./SignInPage.css";
import { useNavigate } from "react-router-dom";
import WebFont from "webfontloader";
import { useUserContext } from "../../context/UserContext";

let userLoginData = {
  username: "",
  password: "",
};

export const SignInPage = () => {
  //to set user info
  const {
    acknowledgeSignIn,
    setUserNameForContext, 
    setUserMajorForContext, 
  } = useUserContext();

  const navigate = useNavigate(); //for page navigation

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [information, setInformation] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  const loginUrl = `http://redditto.lober.ca:${process.env.REACT_APP_BACKEND_PORT}/user/login`; //docker for user services
  const initDbsUrl = `http://redditto.lober.ca:${process.env.REACT_APP_BACKEND_PORT}/init-dbs`;
  
  async function initializeDbs() {
    console.log("Starting to initialize dbs")
    try {
      await axios
        .post(initDbsUrl, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          if (response.status == 201) {
            console.log("Dbs are ready")
          }else{
            console.log("Dbs not initialized")
          }

          return "Dbs have initicalized, function has returned to useEffect()"
        });
    } catch (err) {
      if (err.response) {
        // The client was given an error response (5xx, 4xx)
        console.log("The error response data: " + err.response.data);
        console.log("The error response status: " + err.response.status);
      } else if (err.request) {
        // The client never received a response, and the request was never left
      } else {
        // Anything else
      }
    }
  }

  useEffect(() => {
    // WebFont.load({
    //   google: {
    //     families: ['Droid Sans', 'Roboto',"Secular One"]
    //   }
    // });
    console.log("I Only run once (When the component gets mounted)") 
    console.log(initializeDbs());
   }, []);

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
    if(!toast.isActive(id)){
      return(
        toast({
          id,
          title: 'Cannot login.',
          description: "Username and/or Password is wrong",
          status: 'error',
          duration: 5000,
          isClosable: true,
          position:'top'
        })   
      )
    }
  }

  async function handleLogin() {
    console.log("This is userLoginDate: " + JSON.stringify(userLoginData))
    try {
      await axios
        .post(loginUrl, userLoginData, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log("This is the user data from db: " + JSON.stringify(response.data));
          let usernameFromDb = response.data.userUserName
          let userMajorFromDb = response.data.userMajor
          console.log("This is the major from the db: " + usernameFromDb)
          console.log("This is the major from the db: " + userMajorFromDb)

          if (response.status == 200) {
            setUserNameForContext(usernameFromDb);
            localStorage.setItem('usernameFromDbLocalStorage', usernameFromDb)
            setUserMajorForContext(userMajorFromDb)
            localStorage.setItem('userMajorFromDbLocalStorage', userMajorFromDb)
            acknowledgeSignIn(true) //tells everyone else, the user has signed in
            localStorage.setItem('isUserSignedInLocalStorage', true)
            toast.closeAll();
            navigate("/home");
          }else if (response.status == 401){
            handleInputErrorChecks()
          }
        });
    } catch (err) {
      if (err.response) {
        // The client was given an error response (5xx, 4xx)
        console.log("The error response data: " + err.response.data);
        console.log("The error response status: " + err.response.status);
      } else if (err.request) {
        // The client never received a response, and the request was never left
      } else {
        // Anything else
      }
    }
  }

  const handleUsernameChange = (event) => {
    let input = event.target.value;
    console.log(input);
    //setUsername(input);
    userLoginData.username = input
    validateForm();
  };

  const handlePasswordChange = (event) => {
    let input = event.target.value;
    console.log(input);
    userLoginData.password = input
    validateForm();
  };

  const validateForm = () => {
    setIsFormValid(username !== "" && password !== "");
  };

  return (
    <Flex  w="100%" h="100%" justifyContent={"center"} alignItems={"center"}>
      <VStack w={{base:"full", md: 400}} h={{base:"100%", md:500}} bg={"#1A1A37"} rounded={"lg"} my={100} p={14} gap={5}>
        <HStack alignItems={"center"} h={100} justifyContent={"center"}>
          <Box maxH={50} maxW={50}>
            <Image src={"../favicon.ico"} alt="Logo" className="logo-image" />
          </Box>
          <Heading fontWeight={"semibold"} fontSize={50}>Redditto</Heading>
        </HStack>
      
        <Input 
          bg="white" 
          color="black" 
          placeholder="Username"
          _placeholder={{ opacity: 1, color: 'gray.500' }}
          onChange={handleUsernameChange}
        />
        <Input 
          bg="white" 
          color="black" 
          placeholder="Password"
          _placeholder={{ opacity: 1, color: 'gray.500' }}
          onChange={handlePasswordChange}
        />

        <Button bg="#4736B0" rounded="lg" w={200} p={2} onClick={()=>{
            handleInputErrorChecks()
            handleLogin()
        }}>
          Sign In
        </Button>

        <Text>
          Don't have an account? Create one
          <Button variant={"link"} color="orange" onClick={()=>{
            navigate("/signup")
          }}>
            here
          </Button> 
        </Text>
      </VStack>
    </Flex>
  );
};
