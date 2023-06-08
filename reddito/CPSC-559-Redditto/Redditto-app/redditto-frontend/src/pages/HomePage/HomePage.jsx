import { 
    Flex, 
    //VStack,
    Text,
    HStack,
    Button,
    Input,
    Textarea,
    Heading,
    IconButton,
    useMediaQuery,
    Box,
    Image,
    Stack,
    useToast
} from "@chakra-ui/react";
import { Header } from "../../components/Header";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { TriangleUpIcon, TriangleDownIcon } from '@chakra-ui/icons'
import { useUserContext } from "../../context/UserContext";


//mock post
const post1 = {
    username: "JSmith",
    id: 1,
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullam"
    +
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullam",
    title: "CPSC 559 IS PENG", 
    likes: 17, 
    dislikes: 4, 
    time_created: "12/03/2023", 
    comments:"Bruh",
    major: "CPSC559"
}

let upVoteCount = 0;
let downVoteCount = 0;

let commentData = { 
    content:'',
    postId: 0,
    username: ''
}

//template to display a post created in the Major's subreddit
const Post = ({postInfoFromDb}, {key}) => {
    //page navigation
    const navigate = useNavigate(); 

    const { usernameFromContext, userMajorFromContext} = useUserContext();

    const [upVoted, setUpVote] = useState(false)
    const [downVoted, setDownVote] = useState(false)

    console.log("This is postInfoFromDb: " + postInfoFromDb)
    console.log("This is stringify postInfoFromDb: " + JSON.stringify(postInfoFromDb))
    //post info
    const username = postInfoFromDb.username;
    const postId = key;
    const postContent = postInfoFromDb.content;
    const postTitle = postInfoFromDb.title; 
    const [dislikes, setDislikes] = useState(postInfoFromDb.dislikes); 
    const [likes, setLikes] = useState(postInfoFromDb.likes); 
    const datePosted = postInfoFromDb.time_created; 
    const major = postInfoFromDb.major;

    const [comments, setComments] = useState([]);
    const getPostCommentsUrl = `http://redditto.lober.ca:${process.env.REACT_APP_BACKEND_PORT}/post-comments`;

    async function getPostComments(){
        try{
            await axios.post(getPostCommentsUrl, {'id': postId}, {
                headers: {
                    "Content-Type": "application/json",
                }
            })
            .then((response) => {
                console.log("These are the comments: " + JSON.stringify(response.data.comments))
                setComments([...response.data.comments])
            })
            // .then(()=>{
                
            // }).then(()=>{

            // })
                          
        }catch(err){
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
    useEffect(()=>{ //when user makes a comment
         getPostComments();
    }, [])
    
    const [showComments, setShowComments] = useState(false);

    //gets user input for their post
    const handleCommentInputChange = (e) => {
        commentData.content = e.target.value;
    }

   
    const postCommentsUrl = `http://redditto.lober.ca:${process.env.REACT_APP_BACKEND_PORT}/comment`
    //API to send post to the db
    async function handleCommentButtonClick(){
        if(commentData.content != ''){
            commentData.username = localStorage.getItem('usernameFromDbLocalStorage') || usernameFromContext;
            console.log("This is the Comment Data being sent: " + JSON.stringify(commentData));  
            try{
                await axios.post(postCommentsUrl, commentData, {
                    headers: {
                        "Content-Type": "application/json",
                    }
                }).then((response) => {
                    console.log("Waiting for response")
                    if(response.status == 201){
                        console.log("This is still comment Data: " + JSON.stringify(commentData))
                    }
                })                              
            }catch(err){
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
    }

    return(
        <Flex bg="#383838" p={0.5} rounded="lg" w="100%">
            <Flex w="100%" bg="#191826" rounded="md" p={10} direction="row" alignContent={"center"} gap={5}>
                    {/* Upvots and Downvotes */}
                    <Flex direction="column" h="100%" justifyContent={"center"} alignItems="center" gap={5}>
                        <IconButton 
                            aria-label='Upvote' 
                            icon={<TriangleUpIcon />}  
                            variant="ghost"
                            fontSize="50px"
                            color={"green"}
                            onClick={()=>{
                                if(upVoted == false && upVoteCount == 0){
                                    let newLikes = likes + 1
                                    upVoteCount = 1;
                                    setLikes(newLikes)
                                    setUpVote(true)

                                }else{
                                    let newLikes = likes - 1;
                                    upVoteCount = 0;
                                    setLikes(newLikes)
                                    setUpVote(false)
                                }
                            }} 
                        />
                        <Text fontSize={20}>
                            {likes - dislikes}
                        </Text>
                        <IconButton 
                            aria-label='Downvote' 
                            icon={<TriangleDownIcon />} 
                            variant="ghost"
                            fontSize="50px"
                            color={"red"}
                            onClick={()=>{
                                if(downVoted == false && downVoteCount == 0){
                                    let newDislikes = dislikes + 1
                                    downVoteCount = 1;
                                    setDislikes(newDislikes)
                                    setDownVote(true)
                                }else{
                                    let newLikes = likes - 1;
                                    upVoteCount = 0;
                                    setDislikes(newLikes)
                                    setDownVote(false)
                                }
                            }} 
                        />
                    </Flex>

                    {/* Post content */}
                    <Flex direction="column" wordBreak={"break-all"} gap={5} w="70%">
                        {/* Group posted in, user who posted, date posted */}
                        <Flex direction={"row"} gap={2} alignItems="top">
                            <Text fontSize={20} fontWeight={"semibold"}>
                                {"rto/" + major}
                            </Text>
                            <Text fontSize={20} fontWeight="hairline">
                                {"Posted by " + username + ", " + datePosted}
                            </Text>
                        </Flex>

                        {/* Title, post, no of comments */}
                        <Flex direction="column">
                            <Heading>
                                {postTitle}
                            </Heading>
                            
                            {
                                showComments 
                                ?
                                    <Text fontSize={20}>
                                        {postContent}
                                    </Text>
                                :
                                    <Text noOfLines={2} fontSize={20}>
                                        {postContent}
                                    </Text>
                            }
                        </Flex>

                        {/* No  of comments, "See more" */}
                        <Flex direction={"row"} gap={10} w="100%">
                            {
                                showComments
                                ?
                                    < Flex w="100%" direction="column" gap={5}>
                                        <Button 
                                        bg="#4736B0" 
                                        rounded={"lg"} 
                                        onClick={()=>{
                                            setShowComments(!showComments)
                                        }}
                                        >
                                            Minimize Post
                                        </Button>
                                    
                                        <Flex direction="column" gap={5} w="100%">                      
                                            <Textarea 
                                                placeholder="What comment do you wanna make?" 
                                                minHeight={100} 
                                                fontSize={22} 
                                                bg="#313137"
                                                onChange={handleCommentInputChange}
                                            />
                                            <Button onClick={()=>{handleCommentButtonClick()}}>Post Comment</Button>
                                        </Flex>                                       
                                    </Flex>
                                :
                                <Button 
                                        bg="#4736B0" 
                                        rounded={"lg"} 
                                        onClick={()=>{
                                            setShowComments(!showComments)
                                        }}
                                    >
                                        See More
                                    </Button>
                                    

                            }
                            

                                
                            
                        </Flex>
                    </Flex>
            </Flex>
        </Flex>
    )
}

//post data dictionary for API call
let postData = { 
    content:"",
    title: "",
    username:"",
    major:""
}

let usersMajorData = {
    major: ""
}

//home page content to be displayed
const HomePageContent = () => {
    //to get user info
    const { usernameFromContext, userMajorFromContext} = useUserContext();

    //flags when the user clicks on POST button
    const[postButtonPressed, flagWhenPostButtonPressed] = useState(false);
     
    //gets user input for their post
    const handleContentInputChange = (e) => {
        postData.content = e.target.value;
        console.log("This is the content: " + e.target.value);
    }

    //gets user input for the title of their post
    const handleTitleInputChange = (e) => {
        postData.title = e.target.value;
        console.log("This is the title: " + e.target.value);
    }

    //API endpoint to send post data
    const sendPostUrl = `http://redditto.lober.ca:${process.env.REACT_APP_BACKEND_PORT}/post`;

    //for error notification
    const toast = useToast({
        containerStyle: {
        width: 500,
        maxWidth: "80%",
        minWidth: 300
        },
    })


    //API to send post to the db
    async function handlePostButtonClick(){
        if(postData.content != '' && postData.title != ''){
            postData.username = localStorage.getItem('usernameFromDbLocalStorage');
            postData.major = localStorage.getItem('userMajorFromDbLocalStorage');
            console.log("This is the Post Data being sent: " + JSON.stringify(postData));  
            try{
                await axios.post(sendPostUrl, postData, {
                    headers: {
                        "Content-Type": "application/json",
                    }
                }).then((response) => {
                    console.log("Waiting for response")
                    if(response.status == 201){
                        console.log("This is still post Data: " + JSON.stringify(postData))
                        localStorage.setItem('postData', JSON.stringify(postData));
                    }
                }).then(()=>{
                    let id = 'success toast'
                    if(!toast.isActive(id)){
                        return(
                            toast({
                              id,
                              title: 'Discussion has been posted',
                              description: "Post is empty! Please fill all input boxes!!",
                              status: 'success',
                              duration: 9000,
                              isClosable: true,
                              position:'top'
                            })
                        )
                    }
                }).then(()=>{
                    setPostsFromDb((postsFromDb) => postsFromDb.concat(postData))
                })
                              
            }catch(err){
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
        }else{
            let id = "post-button-toast"
            if(!toast.isActive(id)){
                return(
                    toast({
                      id,
                      title: 'Cannot post discussion post',
                      description: "Post is empty! Please fill all input boxes!!",
                      status: 'error',
                      duration: 9000,
                      isClosable: true,
                      position:'top'
                    })
                )
            }
        }
    }

    //when user cancels to send a post
    const handleCancelButton = () => {
        flagWhenPostButtonPressed(false);
        console.log("Cancel button has been pressed: " + postButtonPressed)
    }

    //API to get all posts from database
    const getPostUrl = `http://redditto.lober.ca:${process.env.REACT_APP_BACKEND_PORT}/major-posts`;
    const [postsFromDb, setPostsFromDb] = useState([]); //array of posts
    const [postsAreLoading, setPostsAreLoading] = useState(true);
    
    async function getPosts(){
        console.log("Getting posts...")
        usersMajorData.major = userMajorFromContext;
        //console.log("This is userMajorData: " +  JSON.stringify(usersMajorData.major));
        try{
            await axios
            .post(getPostUrl, {"major": userMajorFromContext}, {
                headers: {
                  "Content-Type": "application/json",
                },
            }).then((response) => {               
                //postsFromMajor = JSON.stringify(response.data.posts) 
                //console.log("This is the reponse, now in postsFromMajor: " + postsFromMajor)
                setPostsFromDb([...response.data.posts])
            }).then(setPostsAreLoading(false));           
        }catch(err){
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

    const [isLargerThan900] = useMediaQuery('(min-width: 900px)')

    //let postsFromDb1 = [
    //     {"content":"Mushfek is the best TA","dislikes":17,"id":3,"likes":63,"major":"CPSC","time_created":"Fri, 14 Apr 2023 02:28:05 GMT","title":"I love CPSC 559","username":"cd"},
    //     {"content":"Jalal is the best Prof","dislikes":20,"id":2,"likes":100,"major":"CPSC","time_created":"Fri, 14 Apr 2023 02:28:05 GMT","title":"I love CPSC 559","username":"ab"},
    //     {"content":"Nich is a great TA","dislikes":20,"id":1,"likes":45,"major":"CPSC","time_created":"Fri, 14 Apr 2023 02:28:04 GMT","title":"I love CPSC 559","username":"de"}
    // ];

    return(
        <Stack mt={10} alignItems={"top"} gap={10} w="100%" direction={isLargerThan900 ? "row" : "column"}>
            {/* Top panel */}
            <Flex 
                w={"100"}
                float="right"
                display={isLargerThan900 ? "none" : "flex"}
                direction="column"
                h={300}
                minHeight="200px"
                gap={5}
            >
                <Stack 
                    
                    w="100%"
                    bg="#191826"
                    rounded={"lg"}
                    direction={"column"}
                >
                    <Box 
                        w="100%" 
                        h={100}
                        overflow= 'hidden'
                        position= 'relative' 
                        roundedTop={"lg"}
                    >
                        <Image 
                            src="../images/redditto.png"
                        />
                    </Box>
                    
                    <Flex 
                        top={50} 
                        p={5} 
                        w="100%"
                        direction="column"
                        gap = {2}
                    >
                        <Heading>
                            r/{userMajorFromContext}
                        </Heading>
                        <Text fontSize={20} fontWeight={"semibold"}>
                            Home to the {userMajorFromContext} community at the University of Calgary!
                        </Text>
                        <Button 
                            w="100%"
                            h={50} 
                            fontSize={20} 
                            rounded={"lg"} 
                            bg="#4736B0" 
                            onClick={()=>{flagWhenPostButtonPressed(true)}}
                            alignItems={"center"}>
                            Create post
                        </Button>
                        <Button 
                            w="100%"
                            h={50}
                            fontSize={20} 
                            rounded={"lg"} 
                            alignItems={"center"}
                            onClick={()=>{getPosts()}}
                        >
                            Get posts
                        </Button>
                    </Flex>
                </Stack>               
            </Flex>

            {/* Post panel */}
            <Flex direction="column" w={{base: "100%", md: isLargerThan900 ? "70%" : "100%"}} gap ={10} maxW={{base:"100%", md: isLargerThan900 ? "70%" : "60%"}}>            
                {/* Post creation area */}
                {   postButtonPressed
                    ?
                    <Flex direction="column" gap={5} w="100%">
                        <Heading>Create your post</Heading>
                        <Input 
                            placeholder="What's the title of your post?" 
                            minHeight={50} 
                            focusBorderColor='#488EC4'
                            fontSize={22} 
                            bg="#191826"
                            size='lg'
                            onChange={handleTitleInputChange}
                        />
                        <Textarea 
                            placeholder="What do you wanna post to the group?" 
                            minHeight={200} 
                            fontSize={22} 
                            bg="#191826"
                            onChange={handleContentInputChange}
                        />
                        <HStack>
                            <Button onClick={()=>{
                                console.log("Post button pressed")
                                handlePostButtonClick()
                            }}>Post</Button>

                            <Button onClick={()=>{
                                handleCancelButton()
                            }}>Cancel</Button>
                        </HStack>
                    </Flex>
                    :
                    null
                }

                {/*Posts*/}
                <Flex display={postsAreLoading ? "none" : "flex" }w="100%" direction="column">
                {   
                    postsAreLoading 
                    ?                          
                        null
                    :
                        (postsFromDb.map((post)=>{
                            console.log("This is the post from the state: " + post);
                            return(
                                <Post postInfoFromDb={post} key={post.id}/>
                            )
                        }))     
                }                   
                </Flex>               
            </Flex>

            {/* Side panel */}
            <Flex 
                w={postsAreLoading ? "100" : "30%"}
                float="right"
                position="sticky"
                display={isLargerThan900 ? "flex" : "none"}
                direction="column"
                h="100vh"
                minHeight="200px"
                gap={5}
            >
                <Stack 
                    
                    w="100%"
                    bg="#191826"
                    rounded={"lg"}
                    direction={"column"}
                >
                    <Box 
                        w="100%" 
                        h={100}
                        overflow= 'hidden'
                        position= 'relative' 
                        roundedTop={"lg"}
                    >
                        <Image 
                            src="../images/redditto.png"
                        />
                    </Box>
                    
                    <Flex 
                        top={50} 
                        p={5} 
                        w="100%"
                        direction="column"
                        gap = {2}
                    >
                        <Heading>
                            r/{userMajorFromContext}
                        </Heading>
                        <Text fontSize={20} fontWeight={"semibold"}>
                            Home to the {userMajorFromContext} community at the University of Calgary!
                        </Text>
                        <Button 
                            w="100%"
                            h={50} 
                            fontSize={20} 
                            rounded={"lg"} 
                            bg="#4736B0" 
                            onClick={()=>{flagWhenPostButtonPressed(true)}}
                            alignItems={"center"}>
                            Create post
                        </Button>
                        <Button 
                            w="100%"
                            h={50}
                            fontSize={20} 
                            rounded={"lg"} 
                            alignItems={"center"}
                            onClick={()=>{getPosts()}}
                        >
                            Get posts
                        </Button>
                    </Flex>
                </Stack>               
            </Flex>
        </Stack>
    );
}

export const HomePage = () => {
    //to get user info
    // const isUserSignedInLocalStorage = localStorage.getItem('isUserSignedInLocalStorage');
    // if(isUserSignedInLocalStorage){
    return(
        <Header pageContent={<HomePageContent/>} />
    )
    // }else if(!isUserSignedInLocalStorage){
    //     return(
    //         <Flex w="100%">
    //             <Text fontSize={20}> Please go to "/" or "/signup" and sign in properly!</Text>
    //         </Flex>
    //         )
    // }
}