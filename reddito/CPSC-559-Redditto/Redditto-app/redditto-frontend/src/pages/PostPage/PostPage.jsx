import { 
    Flex, 
    VStack,
    Text,
    HStack,
    Button,
    Textarea,
    Heading,
    IconButton,
    Box,
    Image,
    Stack,
    useMediaQuery
} from "@chakra-ui/react";
import { TriangleUpIcon, TriangleDownIcon } from '@chakra-ui/icons'
import { Header } from "../../components/Header";
import { useState, useEffect } from "react";
import axios from 'axios';
import { useUserContext } from "../../context/UserContext";

const Comment = ({commentInfo}) => {
    //user who posted
    const user = commentInfo.commentUserUsername;

    //comment content
    const content = commentInfo.commentContent;

    //comment time posted
    const time = commentInfo.time_created;

    return(
        <Flex direction="column">
            <Text>
                Posted by {user} at {time}
            </Text>
            <Text>
                {content}
            </Text>
        </Flex>
    )
}
const PostPageContent = () => {
    const [isLargerThan700] = useMediaQuery('(min-width: 700px)')

    const username = JSON.parse(localStorage.getItem('username'));
    
    const postId = JSON.parse(localStorage.getItem('postId'));

    const postTitle = JSON.parse(localStorage.getItem('postTitle'));

    const postContent = JSON.parse(localStorage.getItem('postContent'));

    const postDate =  JSON.parse(localStorage.getItem('postDate'));

    const postLikes =  JSON.parse(localStorage.getItem('postDate'));

    const postDislikes =  JSON.parse(localStorage.getItem('postDate'));

    const postMajor =  JSON.parse(localStorage.getItem('postDate'));

    const [dislikes, setDislikes] = useState(postDislikes); 
    const [likes, setLikes] = useState(postLikes);

    let commentData = { 
        commentContent:'',
        commentPostId: postId,
        commentUserId: 0,
        commentUserUsername: username
    }

    //flags when the user clicks on POST button
    const[postButtonPressed, flagWhenPostButtonPressed] = useState(false);
     
    //gets user input for their post
    const handleCommentInputChange = (e) => {
        commentData.commentContent = e.target.value;
    }

    //when user cancels to send a post
    const handleCancelButton = () => {
        flagWhenPostButtonPressed(false);
        console.log("Cancel button has been pressed: " + postButtonPressed)
    }

    const [comments, setComments] = useState([]);
    const getPostCommentsUrl = `http://redditto.lober.ca:${process.env.REACT_APP_BACKEND_PORT}//post-comments`;

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

    //API endpoint to send post data
    const url = `http://redditto.lober.ca:${process.env.REACT_APP_POST_SERVICE_PORT}/comment`;

    async function handlePostButtonClick(){
        console.log(commentData);  
        try{
            await axios.post(url, commentData, {
                headers: {
                "Content-Type": "application/json",
                }
            }).then((response) => {
                console.log("After sendin the post, this is the response: " + JSON.stringify(response.data.postSent))
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

    return(
        <HStack mt={10} alignItems={"top"} gap={10} w="100%">
            {/* Post info */}
            <Flex bg="#383838" p={0.5} rounded="lg" minW={"70%"} w={isLargerThan700 ? "70%" : "100%"}>
                <Flex w="100%" bg="#191826" rounded="md" p={10} direction="row" gap={5}>
                        {/* Upvotes and Downvotes */}
                        <VStack direction="column" gap={5}>
                            <IconButton 
                                aria-label='Upvote' 
                                icon={<TriangleUpIcon />}  
                                variant="ghost"
                                fontSize="50px"
                                color={"green"}
                                onClick={()=>{
                                    let newLikes = likes + 1
                                    setLikes(newLikes)
                                }} 
                            />
                            <Text fontSize={20} fontWeight={"bold"}>
                                {likes - dislikes}
                            </Text>
                            <IconButton 
                                aria-label='Downvote' 
                                icon={<TriangleDownIcon />} 
                                variant="ghost"
                                fontSize="50px"
                                color={"red"}
                                onClick={()=>{
                                    let newDislikes = dislikes + 1
                                    setDislikes(newDislikes)
                                }} 
                            />
                        </VStack>

                        {/* Post content and comments*/}
                        <Flex direction="column" wordBreak={"break-all"} gap={5} w="100%">
                            {/* Group posted in, user who posted, date posted */}
                            <Flex direction={"row"} gap={2} alignItems="top">
                                <Text fontSize={20} fontWeight={"semibold"}>
                                    {"rto/" + postMajor}
                                </Text>
                                <Text fontSize={20} fontWeight="hairline">
                                    {"Posted by " + username + ", " + postDate}
                                </Text>
                            </Flex>

                            {/* Title, post, no of comments */}
                            <Flex direction="column">
                                <Heading>
                                    {postTitle}
                                </Heading>
                                <Text fontSize={20}>
                                    {postContent}
                                </Text>
                            </Flex>

                            {/* Comments */}
                            <Flex direction="column" gap={5} w="100%">                      
                                <Textarea 
                                    placeholder="What comment do you wanna make?" 
                                    minHeight={100} 
                                    fontSize={22} 
                                    bg="#313137"
                                    onChange={handleCommentInputChange}
                                />
                                <HStack>
                                    <Button onClick={handlePostButtonClick}>Post</Button>
                                    <Button onClick={handleCancelButton}>Cancel</Button>
                                </HStack>
                            </Flex>

                            <Flex w="100%">
                                {
                                    comments.map((comment) => {

                                        // return(
                                        // )
                                    })
                                }
                            </Flex>
                        </Flex>

                </Flex>
            </Flex>

            {/* Server info */}
            <Flex 
                w="30%" 
                position="sticky"
                display={isLargerThan700 ? "flex" : "none"}
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
                            r/{postMajor}
                        </Heading>
                        <Text fontSize={20} fontWeight={"semibold"}>
                            Home to the {postMajor} community at the University of Calgary!
                        </Text>                       
                    </Flex>
                </Stack>                
            </Flex>
        </HStack>
    )
}

// export const PostPage = () => {
//     return(
//         <Header pageContent={<PostPageContent/>} />
//     )
// }

export const PostPage = () => {
    //to get user info
    // const isUserSignedInLocalStorage = JSON.parse(localStorage.getItem('isUserSignedInLocalStorage'));
    // if(isUserSignedInLocalStorage){
    return(
        <Header pageContent={<PostPageContent/>} />
    )
    //  }else if(!isUserSignedInLocalStorage){
    //     return(
    //         <Flex w="100%">
    //             <Text fontSize={20}> Please go to "/" or "/signup" and sign in properly!</Text>
    //         </Flex>
    //     )
    //  }
}