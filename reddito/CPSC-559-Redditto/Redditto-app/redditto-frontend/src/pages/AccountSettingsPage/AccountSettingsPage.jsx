import { 
    Flex, 
    Divider,
    Image,
    Text,
    Box,
    Input,
    HStack,
    Button,
    VStack,
    SimpleGrid,
    List,
    ListIcon,
    ListItem,
    useToast,
} from "@chakra-ui/react";
import { Header } from "../../components/Header";
import './AccountSettingsPage.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUserContext } from "../../context/UserContext";
import { CheckCircleIcon, SmallCloseIcon } from "@chakra-ui/icons";


    const InputTitleText = (props) => {
        const title = props.title;
        return (
        <Text fontSize={{ base: 20, md: 20 }} fontStyle={"Roboto"} fontWeight={"bold"}>
            {title}
        </Text>
        );
    };

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


    const AccountSettingsContent =() => {

        const { userNameFromContext, userMajorFromContext } = useUserContext();

        //user data dictionary
        let userData = {
            first_name: "",
            last_name: "",
            username: JSON.parse(localStorage.getItem('usernameFromDbLocalStorage')) || userNameFromContext,
            major: JSON.parse(localStorage.getItem('userMajorFromDbLocalStorage')) || userMajorFromContext ,
            password: "",
            email:""
        };

        const navigate = useNavigate();

        async function getUserInfo(){

            try {
                var res = await axios
                  .get(url, userData.username, {
                    headers: {
                      "Content-Type": "application/json",
                    },
                  })
                  .then((res) => {
                    userData.first_name = res.data.first_name
                    userData.last_name = res.data.last_name
                    userData.email = res.data.email
                    userData.major = res.data.major
                    userData.password = res.data.password
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
    
        }
            




        function handleFirstNameChange(e) {
            setFirstName(e.target.value)
            let inputValue = e.target.value;
            nameChecks.hasDigit = /[0-9]+/.test(inputValue);
            nameChecks.hasSpecialChar = /[^A-Za-z0-9]+/.test(inputValue);
            if (!nameChecks.hasDigit && !nameChecks.hasSpecialChar) {
              userData.first_name = inputValue;
              console.log(userData.first_name);
              this.setFirstName(inputValue)
            }
        }
        function handleLastNameChange(e) {
            setLastName(e.target.value)
            let inputValue = e.target.value;
            nameChecks.hasDigit = /[0-9]+/.test(inputValue);
            nameChecks.hasSpecialChar = /[^A-Za-z0-9]+/.test(inputValue);
            if (!nameChecks.hasDigit && !nameChecks.hasSpecialChar) {
                userData.last_name = inputValue;
            }
            console.log(userData.last_name);
        }
        function handleUsernameChange(e) {
            setUsername(e.target.value)
            let inputValue = e.target.value;
            userData.username = inputValue;
            console.log(userData.username);
        }
        function handleMajorChange(e) {
            setMajor(e.target.value)
            let inputValue = e.target.value;
            userData.major = inputValue;
            console.log(userData.major);
        }



  //user input checks
  const nameChecks = {
    hasDigit: false,
    hasSpecialChar: false,
  };


  const [hasDigit, setDigitBoolean] = useState(false)
  const [hasUpperCase, setUpperCaseBoolean] = useState(false)
  const [hasLength, setLengthBoolean] = useState(false)
  const [hasSpecialChar, setSpecialCharBoolean] = useState(false)

         //for password check
  const minLength = 6;
  const strengthChecks = {
    length: 0,
    hasUpperCase: false,
    hasLowerCase: false,
    hasDigit: false,
    hasSpecialChar: false,
  };

  const [progress, setProgress] = useState("");
  const [firstName, setFirstName] = useState(userData.first_name);
  const [lastName, setLastName] = useState(userData.last_name);
  const [email, setEmail] = useState(userData.email);
  const [major, setMajor] = useState(userData.major);
  const [password, setPassword] = useState(userData.password);
  const [username, setUsername] = useState(userData.username);

  function handlePasswordChange(e) {
    setPassword(e.target.value);
    var passwordValue = e.target.value;

    //for password checks
    strengthChecks.length = passwordValue.length >= minLength ? true : false;
    strengthChecks.hasUpperCase = /[A-Z]+/.test(passwordValue);
    strengthChecks.hasLowerCase = /[a-z]+/.test(passwordValue);
    strengthChecks.hasDigit = /[0-9]+/.test(passwordValue);
    strengthChecks.hasSpecialChar = /[^A-Za-z0-9]+/.test(passwordValue);

    var verifiedList = Object.values(strengthChecks).filter((value) => value);
    var strength =
      verifiedList.length == 5
        ? "Strong"
        : verifiedList.length >= 2
        ? "Medium"
        : "Weak";
    userData.password = passwordValue;
    // setProgress(`${(verifiedList.length / 5) * 100}%`);
    console.log("This is the password as the end:" + userData.password);
    console.log("verifiedList: ", `${(verifiedList.length / 5) * 100}%`);
  }

//for error notification
    const toast = useToast({
        containerStyle: {
            width: 500,
            maxWidth: "80%",
            minWidth: 300
        },
    })


  //docker
  const url = `http://redditto.lober.ca:${process.env.REACT_APP_BACKEND_PORT}/user`;
  //app.py by itself
  //const url = "http://localhost:5001/user";



    

      //sends user information
    async function handleUpdateButtonClick() {
        if(signUpBooleans.canSubmit){
        userMajorFromContext(userData.major)
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
            bg={"#5B73FF"}
            bgClip={"text"}
            fontSize={{ base: 30, md: 40 }}
            fontWeight={"bold"}
            >
            Account Settings
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
                    
                    //borderColor={"#9f78ff"}
                    focusBorderColor="#488EC4"
                    size="lg"
                    value={firstName} 
                    //onChange={(e) => setFirstName(e.target.value)}
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
                    
                    focusBorderColor="#488EC4"
                    size="lg"
                    width='auto'
                    value={lastName}
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
                
                focusBorderColor="#488EC4"
                size="lg"
                width='auto'
                disabled
                value={username}
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
                
                focusBorderColor="#488EC4"
                size="lg"
                width='auto'
                value={major}
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
                
                focusBorderColor="#488EC4"
                size="lg"
                width='auto'
                value={password}
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
            onClick={handleUpdateButtonClick}
            >
            Update
            </Button>
        </VStack>
        );
    };


    export const AccountSettingsPage = () => {
      //check if user is signed in
      // const isUserSignedInLocalStorage = JSON.parse(localStorage.getItem('isUserSignedInLocalStorage'));
      // if(isUserSignedInLocalStorage){
            return(
                <Header pageContent = {<AccountSettingsContent />}/>
            );
        // }else if(!isUserSignedInLocalStorage){
        //     return(
        //         <Flex w="100%">
        //             <Text fontSize={20}> Please go to "/" or "/signup" and sign in properly!</Text>
        //         </Flex>
        //     )
        // }
        

}


