import { 
    Flex, 
    Image,
    Text,
    Box,
    HStack,
    Icon,
    IconButton
} from "@chakra-ui/react";
import { 
    HamburgerIcon, 
} from '@chakra-ui/icons'
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";

//import { useState } from "react";

export const Header = (props) => {
    const pageContent = props.pageContent;

    //page navigation
    const navigate = useNavigate(); 

    return(
        <>
            <HStack 
                gap={2} 
                justifyContent={"space-between"} 
                alignItems={"center"} 
                bg={"#272F79"} 
                px={{base:10, md:10}} 
                py={{base:5, md:3}}>
                {/* Logo and app name */}
                <Flex w="50%" minW={150} alignItems="center">
                    <Box boxSize={12}>
                        <Image src="../favicon.ico"/>
                    </Box>
                    <Text fontWeight={"bold"} fontSize={{base:24, md:30}}>
                        Redditto
                    </Text>
                </Flex>

                {/*Icons*/}
                <Flex w="50%" justifyContent={"flex-end"}>
                    <IconButton aria-label='Menu' icon={<HamburgerIcon />}  w={8} h={8} onClick={()=>{navigate('/settings')}}/>
                </Flex>
            </HStack>

            <Flex mx={{base:10, md:10, lg:10}} direction={"column"} h={40}> 
                <Flex w="100%">
                    {pageContent}
                </Flex>
            </Flex>        
        </>
    )  
}