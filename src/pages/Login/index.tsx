import {
    Paper,
    TextInput,
    PasswordInput,
    Checkbox,
    Button,
    Title,
    Text,
    Anchor,
    Container,
    Group,
    Space,
    Center,
    Box,
    Progress,
} from "@mantine/core";
import "./style.scss";
import heroCover from "../../assets/hero_cover.png";
import axios from "axios";
import { IP_ADDRESS } from "../../connection";
import { useEffect, useRef, useState } from "react";
import {
    login,
    getUser,
    logout,
    register,
} from "../../Controllers/authentication";
import { showNotification } from "@mantine/notifications";
import { Check, ExclamationMark, X } from "tabler-icons-react";
import { useInputState } from "@mantine/hooks";
import { useTranslation } from "react-i18next";

export default function Login(props: any) {
    // useImperativeHandle(ref, () => ({
    //     showAlert() {
    //         console.log("Hello from Child Component");
    //         setIsRegistering(false);
    //     },
    // }));

    // const [isRegistering, setIsRegistering] = useState(false);
    const { t } = useTranslation();

    const [token, setToken] = useState("");
    const [email, setEmail] = useState("");
    const [nickname, setNickname] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [registerLoading, setRegisterLoading] = useState(false);

    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    const [registerEmail, setRegisterEmail] = useState("");
    const [registerEmailError, setRegisterEmailError] = useState<any>(false);
    const [nicknameError, setNicknameError] = useState<any>(false);
    const [RegisterPasswordError, setRegisterPasswordError] =
        useState<any>(false);

    const registerPasswordInput = useRef(null);

    let passwordStrength = 0;

    useEffect(() => {
        setLoading(false);
        setEmail("");
        setEmailError(false);
        setPassword("");
        setPasswordError(false);
        setNickname("");
        setNicknameError(false);
        setRegisterEmail("");
        setRegisterEmailError(false);
        setRegisterPasswordError(false);
    }, [props.isRegistering]);

    const tryLogin = () => {
        setLoading(true);

        if (email == "" || password == "") {
            setLoading(false);
            if (email == "") setEmailError(true);
            if (password == "") setPasswordError(true);
            return;
        }

        login(email, password)
            .then((res: any) => {
                // console.log(res)
                props.loginStatus();
                showNotification({
                    icon: <Check size={30} />,
                    autoClose: 3000,
                    title: "Loged in",
                    message: `Welcome back ${res.username}!`,
                });
                // setLoading(false);
            })
            .catch((err) => {
                if (err == 404) {
                    setEmailError(true);
                    setPasswordError(true);
                    setLoading(false);
                    showNotification({
                        color: "red",
                        icon: <ExclamationMark size={30} />,
                        autoClose: 5000,
                        title: "Login failed",
                        message: "Email or password incorret!",
                    });
                }
            });
    };

    const tryRegister = () => {
        setLoading(true);
        if (
            nickname == "" ||
            registerEmail == "" ||
            registerPasswordInput.current.value == "" ||
            passwordStrength < 100
        ) {
            setLoading(false);

            if (nickname == "") setNicknameError(true);
            if (registerEmail == "") setRegisterEmailError(true);
            if (registerPasswordInput.current.value == "")
                setRegisterPasswordError(true);
            if (passwordStrength < 100) {
                setRegisterPasswordError("Chose a stronger password");
            }
            return;
        }

        setRegisterPasswordError(false);

        register(nickname, registerEmail, registerPasswordInput.current.value)
            .then((res: any) => {
                // console.log(res);
                if (res == 200) {
                    
                    showNotification({
                        icon: <Check size={30} />,
                        autoClose: 3000,
                        title: "Login success",
                        message: `Welcome aboard!`,
                    });
                    
                    setTimeout(() => {
                        setLoading(false);
                        props.setIsRegistering(false);
                        // console.log("redirect to login");
                    }, 2000)
                    
                }
            })
            .catch((err) => {
                console.log(err);
                if (err == 201) {
                    // Nick in use
                    setLoading(false);
                    setNicknameError("Nickname in use");
                } else if (err == 202) {
                    // Email in use
                    setLoading(false);
                    setRegisterEmailError("Chose another email address");
                }
            });
    };

    function PasswordRequirement({
        meets,
        label,
    }: {
        meets: boolean;
        label: string;
    }) {
        return (
            <Text color={meets ? "teal" : "red"} mt={5} size="sm">
                <Center inline>
                    {meets ? (
                        <Check size={14} strokeWidth={1.5} />
                    ) : (
                        <X size={14} strokeWidth={1.5} />
                    )}
                    <Box ml={7}>{label}</Box>
                </Center>
            </Text>
        );
    }

    function getStrength(password: string) {
        let multiplier = password.length > 5 ? 0 : 1;

        requirements.forEach((requirement) => {
            if (!requirement.re.test(password)) {
                multiplier += 1;
            }
        });

        return Math.max(
            100 - (100 / (requirements.length + 1)) * multiplier,
            0
        );
    }

    const requirements = [
        { re: /[0-9]/, label: "Includes number" },
        { re: /[a-z]/, label: "Includes lowercase letter" },
        { re: /[A-Z]/, label: "Includes uppercase letter" },
        { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: "Includes special symbol" },
    ];

    function PasswordStrength() {
        const [value, setValue] = useInputState("");
        const strength = getStrength(value);
        passwordStrength = strength;

        const checks = requirements.map((requirement, index) => (
            <PasswordRequirement
                key={index}
                label={requirement.label}
                meets={requirement.re.test(value)}
            />
        ));
        const bars = Array(4)
            .fill(0)
            .map((_, index) => (
                <Progress
                    styles={{ bar: { transitionDuration: "0ms" } }}
                    value={
                        value.length > 0 && index === 0
                            ? 100
                            : strength >= ((index + 1) / 4) * 100
                            ? 100
                            : 0
                    }
                    color={
                        strength > 80
                            ? "teal"
                            : strength > 50
                            ? "yellow"
                            : "red"
                    }
                    key={index}
                    size={4}
                />
            ));

        return (
            <div>
                <PasswordInput
                    ref={registerPasswordInput}
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value);
                        // setRegisterPasswordError(false);
                    }}
                    placeholder="Your password"
                    label="Password"
                    error={
                        RegisterPasswordError == true ||
                        RegisterPasswordError == false
                            ? ""
                            : RegisterPasswordError
                    }
                    required
                />

                <Group spacing={5} grow mt="xs" mb="md">
                    {bars}
                </Group>

                <PasswordRequirement
                    label="Has at least 6 characters"
                    meets={value.length > 5}
                />
                {checks}
            </div>
        );
    }

    return (
        <div
            className="login"
            style={{ backgroundImage: "url(" + heroCover + ")" }}
        >
            <Container size={420}>
                {props.isRegistering == false ? (
                    <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                        <Title
                            align="center"
                            sx={(theme) => ({
                                fontFamily: `Greycliff CF, ${theme.fontFamily}`,
                                fontWeight: 900,
                            })}
                        >
                            Welcome back!
                        </Title>
                        <Text color="dimmed" size="sm" align="center" mt={5}>
                            Do not have an account yet?{" "}
                            <Anchor<"a">
                                href="#"
                                size="sm"
                                onClick={(event) => {
                                    event.preventDefault();
                                    props.setIsRegistering(true);
                                }}
                            >
                                Create account
                            </Anchor>
                        </Text>

                        <Space h="xl" />

                        <TextInput
                            label="Email"
                            placeholder="your@mail.com"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setEmailError(false);
                            }}
                            autoFocus
                            error={emailError}
                            required
                        />
                        <PasswordInput
                            label="Password"
                            placeholder="Your password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setPasswordError(false);
                            }}
                            onKeyDown={(e) => { if (e.key == "Enter") tryLogin() }}
                            error={passwordError}
                            required
                            mt="md"
                        />
                        <Group position="apart" mt="md">
                            <Checkbox label="Remember me" />
                            <Anchor<"a">
                                onClick={(event) => event.preventDefault()}
                                href="#"
                                size="sm"
                            >
                                Forgot password?
                            </Anchor>
                        </Group>
                        <Button
                            loading={loading}
                            fullWidth
                            mt="xl"
                            onClick={tryLogin}
                        >
                            Sign in
                        </Button>
                    </Paper>
                ) : null}

                {props.isRegistering ? (
                    <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                        <Title
                            align="center"
                            sx={(theme) => ({
                                fontFamily: `Greycliff CF, ${theme.fontFamily}`,
                                fontWeight: 900,
                            })}
                        >
                            Begin your adventure
                        </Title>

                        <Text align="center" size="sm">
                            {t("hero5")}{" "}
                            <Anchor<"a">
                                href="#"
                                size="sm"
                                onClick={(event) => {
                                    event.preventDefault();
                                    props.setIsRegistering(false);
                                }}
                            >
                                {t("hero6")}
                            </Anchor>{" "}
                            {t("hero7")}.
                        </Text>

                        <Space h="xl" />

                        <TextInput
                            label="Nickname"
                            placeholder="Pick a nickname"
                            value={nickname}
                            onChange={(e) => {
                                setNickname(e.target.value);
                                setNicknameError(false);
                            }}
                            error={
                                nicknameError == true || nicknameError == false
                                    ? ""
                                    : nicknameError
                            }
                            disabled={loading}
                            required
                        />

                        <Space h="xl" />

                        <TextInput
                            label="Email"
                            placeholder="your@mail.com"
                            value={registerEmail}
                            onChange={(e) => {
                                setRegisterEmail(e.target.value);
                                setRegisterEmailError(false);
                            }}
                            error={
                                registerEmailError == true ||
                                registerEmailError == false
                                    ? ""
                                    : registerEmailError
                            }
                            disabled={loading}
                            required
                        />

                        <Space h="xl" />

                        <PasswordStrength />

                        <Button
                            loading={loading}
                            fullWidth
                            mt="xl"
                            onClick={tryRegister}
                        >
                            Register
                        </Button>
                    </Paper>
                ) : null}
            </Container>
        </div>
    );
}
