"use client"
import React, { useState, useRef, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { LoginBox, Container, Title, Button, InputArea, ContextTextArea, ContextTextAreaContainer, ContextMicIcon, TextAreaContainer, TextAreaWithIcon, MicIcon, SpeakerIcon, OptionsRow, OptionButton, ErrorMsg, TextArea } from "../MainInterface.styles";

export default function SignupPage() {
    const [age, setAge] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isSigningUp, setIsSigningUp] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [likedFoods, setLikedFoods] = useState("");
    const [likedPeople, setLikedPeople] = useState("");
    const [likedActivities, setLikedActivities] = useState("");
    const [dislikedFoods, setDislikedFoods] = useState("");
    const [dislikedActivities, setDislikedActivities] = useState("");
    const [signupStep, setSignupStep] = useState(1);
    const formRef = useRef<HTMLFormElement>(null);
    const handleSignup = () => {
    // In real app, call backend API here
        setIsSigningUp(true);
    };

    const handleNext = (next_num: number) => {
        const form = formRef.current;
        if (form && form.checkValidity()) {
            setSignupStep(next_num);
        } else {
            form?.reportValidity();
        }
    };
    const renderSignupForm = () => {
        switch(signupStep) {
        case 1:
            console.log(1);
            return (
            <form ref={formRef}>
            <h1>Sign Up</h1>
            <h2>Basic Information</h2>
            <InputArea
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <InputArea
                placeholder="Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
            />
            <InputArea
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                />
            <InputArea
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <Button type="button" onClick={()=>handleNext(2)}>Next</Button>
            </form>
            );
        case 2:
            console.log(2);
            return (
            <form ref={formRef}>
            <h1>Sign Up</h1>
            <h2>Basic Information</h2>
                <InputArea
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                />
                <InputArea
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                />
                <Button onClick={() => setSignupStep(1)}>Back</Button>
                <Button type="button" onClick={()=>handleNext(3)}>Next</Button>
            </form>
            );
        case 3:
            console.log(3);
            return (
            <form ref={formRef}>
                <h1>Sign Up</h1>
                <Button onClick={() => setSignupStep(2)}>Back</Button>
                <Button type="button" onClick={()=>handleNext(4)}>Next</Button>
            </form>
            );
        case 4:
            console.log(4);
            return (
            <form ref={formRef}>
                <h2>Sign Up</h2>
                <h1>Likes</h1>
                    <InputArea
                    placeholder="Favorite Food (ex. pizza, biryani, pho, french fries)"
                    value={likedFoods}
                    onChange={(e) => setLikedFoods(e.target.value)}
                    required
                    />
                    <InputArea
                    placeholder="Important people in their life with relation and nickname (ex. Priya - Mother - Amma, Bob - Cousin - Bob, )"
                    value={likedPeople}
                    onChange={(e) => setLikedPeople(e.target.value)}
                    required
                    />
                    <InputArea
                    placeholder="Favorite Activities (ex. Baseball, Soccer, Reading)"
                    value={likedActivities}
                    onChange={(e) => setLikedActivities(e.target.value)}
                    required/>
                <Button onClick={() => setSignupStep(3)}>Back</Button>
                <Button type="button" onClick={()=>handleNext(5)}>Next</Button>
            </form>
            );
        case 5:
            console.log(4);
            return (
            <form ref={formRef}>
                <h2>Sign Up</h2>
                <h1>Dislikes</h1>
                    <InputArea
                    placeholder="Hated Food (ex. Broccoli, Bellpeppers, Cheese)"
                    value={dislikedFoods}
                    onChange={(e) => setDislikedFoods(e.target.value)}
                    required
                    />
                    <InputArea
                    placeholder="Hated Activities (ex. Homework, Eating vegetables, Basketball)"
                    value={dislikedActivities}
                    onChange={(e) => setDislikedActivities(e.target.value)}
                    required/>
                <Button onClick={() => setSignupStep(4)}>Back</Button>
                <Button type="button" onClick={()=>handleNext(6)}>Next</Button>
            </form>
            );
        case 6:
            console.log(5);
            return (
            <>
                <p>Confirm your details:</p>
                <p>Username: {username}</p>
                <p>Email: {email}</p>
                <Button onClick={() => setSignupStep(4)}>Back</Button>
                <Button onClick={() =>handleSignup()}>Submit</Button>
            </>
            );
        default:
            return null;
        }
    };
    // const navigate = useNavigate();

    return (renderSignupForm());
}