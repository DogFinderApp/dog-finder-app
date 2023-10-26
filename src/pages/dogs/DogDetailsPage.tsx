// import useSWR from "swr";
import { Box, Button, CardMedia, Typography, useTheme } from "@mui/material";
import { PageContainer } from "../../components/pageComponents/PageContainer/PageContainer";
import { AppTexts } from "../../consts/texts";
import { Dog } from "../../components/resultsComponents/ResultsGrid";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useGetServerApi } from "../../facades/ServerApi";
import { DogType } from "../../facades/payload.types";
import { AppRoutes } from "../../consts/routes";
import {
    TablerIconsProps,
    IconPhoneCall,
    IconArrowLeft,
} from "@tabler/icons-react";

// const fetcher = async (
//     payload: { img: Blob; type: DogType },
//     getServerApi: Function
// ) => {
//     const serverApi = await getServerApi();
//     const response = await serverApi.searchDog(payload);
//     if (response?.ok) {
//         const json = await response.json();
//         return json?.data?.results || [];
//     } else {
//         throw new Error("Failed to fetch results");
//     }
// };

export const DogDetailsPage = () => {
    const { state: payload } = useLocation();
    const getServerApi = useGetServerApi();
    const { dog_id } = useParams();
    const navigate = useNavigate();
    const theme = useTheme();

    // const {
    //     data: results,
    //     error,
    //     isLoading,
    //     mutate,
    // } = useSWR([payload], async () => await fetcher(payload, getServerApi), {
    //     keepPreviousData: false,
    //     revalidateOnFocus: false,
    // });

    const dog: Dog = {
        contactEmail: "null",
        contactName: "סילביה",
        contactPhone: "0547897987",
        dogId: "f6ce6977-7e42-467e-9ffc-223f3498ee06",
        image: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHCBYWFRgVFhYYGRgZHBwYGRoYGhkYHBocGRoaGhwZGRgcIS4lHB8rIRgYJjgmKy8xNTU1GiU7QDs0Py40NTEBDAwMEA8QHhISHjQrJCs0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQxNDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0Mf/AABEIALcBEwMBIgACEQEDEQH/xAAcAAACAgMBAQAAAAAAAAAAAAADBAIFAAEGBwj/xAA8EAACAQMDAgMHAgUCBQUBAAABAhEAAyEEEjFBUQUiYQYTMnGBkaFCsQfB0eHwUmIUI1OCkjOistLxQ//EABgBAQEBAQEAAAAAAAAAAAAAAAABAgME/8QAIBEBAQEBAAMAAwEBAQAAAAAAAAERAhIhMQNBURMyIv/aAAwDAQACEQMRAD8A9LtXqdS5VFbu00l+vHz3j19cLVrlYLlV635qQv5rXmx4LJXqe6krd6i763OozeBg1T3UtNTDVZ0zeRd1b3UAvUQ9XyPEdmoe6htcoRu1L01OTBeti7SL3opa5rBU8l8VqdQKV1OqEVS6nXxwaqtR4oe9a1PExr9Vkwa5/Waxpipvq5NL3lmstyAJek5pjfSzW4olsUxLUGYzS2pYmmymaU1SkUUqiZg0z7kATQ3EQaI1zFExJHmltSm4+tbDQa3qBkEVMalI3VIFANzFOXj3pMpVZ3KQ1JzSN56srqTSt62Ip457YpQ0K408VN6gi5rUZZ0zWi+Ird00GkmprdZUaytYr3ldSaImqJpK2ZFYrwa8Ee6xcWbtHV5NVC3qb093NbjFXdpqIHpNLmKz39b1lZB6g16lffClL2ozTU8Tl/VxQF14pDVPNc14/wC09rSjafPcORbUgEern9I/JqyW30XJPbs9T4giIzuwVFBZieABkk1zGl/iHpHubA7rJgM6wpP7j6gV5v4j7aam+htuVVGPmCLEjkKSZMcVzlxduR8x/Wu3P4v65dfl/j6DfxFXAKMGB4IMg/WqzVakjrVB7GXy+nJJJG6QfmBI+4P3q21WaxefG43OthPUas96Te4TRb9uTWrdk1U0pvM5o4cxNEbT5rb2zEUNDW5NSLVtLGKC+DRErr0N23CtuaXutjFGk4BEUI2aipPNOWjIzQ0pcTNSfis1ODNDvPKyKBO+aEeKK5obcGqyrzNCuCacCbqKUUCKnX5JyTnVQbeKVu4q01Ag0u1gGpOt91LFW4NaZacexQ/c1udRjCu2so3ujWVrUx7NY4obtmoWbs04tgNXj5517eusKLdzT9l6GNBmmremrXhWP9OcMLexWO5GawWq09ur4Vnz5Ka3xIpbdwNxRSQvExT/ALModTZW7dtm2WEgBjx0MEfX60olkhgYBgzB4PoR2q30muRFCfBGADxHYGunEnzpjvq3/muf9ufFU0NsMqF3c7UDOQoMHzEASQO0j514v4jcD3C4cuz+dyRBDMSWHqO3pjpXe/xH0uquXCyFrlgCVVdp298ck15zEHI4716OZzPjjb1fobCD2rZcHpxR7i7hz6/yolnTYPpn8fyzWmXYewxcbgqlkCjfH6ZLbWPoCpH/AHCuvOaW/g5piDqGK4IQBj6l5X7BT9a6Lx7wwW33KIR/sG6j0rn3P26cdfqufdOtES3NTuJU7QiuTo0tmtPZpgYqZWaCqvpAqvvKaudRbpc2wcUaIJbkUO5ZAq0WxFL3LYmpUlJi3IrRwKMyRxQXQmrKtL3bkiKAcCnPdiIPND93gg1YlKe5ml9RbgVZEQtKsu6pphGwlQ1P5o11CDApPUhhzXC/+utL6gDP3rTOFFBBJoTsTiuk51jUGuknFQS4Zqe2KG1dMjI+4VlK7jW6eK69U0b5q509yub05M1bWAwiuPPp6Ova7R6IrVXo5FNW7kiu3NebqGN1RLVFTW5rbLZcCuf8b1GqG4WLJeYK3FKeXkFShkmcGcfvV09smlxpSDIJB9Klt/jXNxQabwjxABLnu9O7wT/zLjkgnaRuQFUBG3pPxH0rl/av2f1pY3rlpPh3O1raEEcluM5z/avS1Rpy7fc1PxXw5r+jvJujcpAPyyZjmrz17+L1bZ7rw/wS0HuBW45/IH86vtDoGu3lS2JLkj0ABG6fTn7Gu19lPYZLNh3u/wDq3E2z/wBNSP0/7vWup8A8AtadYQcH4jkmec1q1iWYtPA/Dk09lLSCAoj1J6k9zVjctq6lWAIPINAV+lav6lUBJIEDqYzSMqHX+zpXzWzuH+lsEfXg/iqd7DKYIg0z457a2bbWlS4CXdVYgiAm7a7knEDJE8wDkHPk/ivtXqLjuwuuELuyLuMqpbCycxEYmOaX8candeolMVHdFeaJ7W6hQBv9M5yPn0MUxa9t7n60Un5kT8ulS8Vqdx6HccGhe4rhLntxcI8qIPXJPyikX9stSTIeP9oVYHyxU8LTzkejPjFL3LU5rz277V6lhm59gqn7gUO17Ualf/6Ej/dB/NL+O/0n5I7lsGDU3TFcNc9przZ3R9B+8VFfaa//AK/wp/lU/wAr/Wv9ef47G4s1EVz+k9qP9ag+q4P24ro9LrbLruDr2g4IPqKz1z1I1z1zaBeTFLWFAJmrJlBkAg/Kq+7abcBWY1UdUAM1V323V0dzTgrVNqdK3SvPecutWarXKjFKXbPanzpGnNZqNKRFdOfTFiqS3NQuJFPPbg0pe7V2l9s2ei+ysqeysrXtl67a06inVtilwM00jVicLe29tFVa0DRFaa3OWL0mtSIqE1uarOoPcipoZrFUdaMgFP2s+BlKtvC8owPeq4irHwsQGFJPa2qf2i8WRCiZJLQFHLR+wHfpFJeG+Pi5dZEyEBLsPgTsoY/E09uxmK4b+Imoupq2JJClQqxPkDTMf7iP8xS2q1v/AA+jFpBte55n4nP6T6AYI67z8h0nxzv11Xj/APEIWhstDc5E7j2PDH55IHaD1ivPPG/aTUalvO528BAYX/xHJ+c1VM5YlmMk5k9SahuH0FaVJyTyf87VDb+37mpg4msUUEXH+f58qiUNTLAZ+lbVyelBBVyR0NagcxR/d9f8zxUTFAHbnPWtsOa1eaPp/f8ApQV1FARu1R3VBr3FbQzmgkDRRecDymDWbQM/586gTQWfg/jD23BYkjrXoemvJeQOmQfx6GvKkzXW+xWr23vctw4MejKCfyAfxXL8nGzY3x1lx2TWgBSF63FXN+3S9zTV5bNj0yudurJgUK7ZmrjUaOMig6axuJxWeZ/Vqg1OmxNIXNNma7HU6MEVV6nSgV156ZvOuaZKyrK5pcnFZW/JnxejIaOhpdBAqYuVt5jQNFBgUit2jW72YNAdTNGBpdng4oouCluNyantNadWqSvWxcBrFurmBh2Bq18KO4k+n70gFp3RXQpgnmtc4l1y/wDErw9Wtpdj4H3ccmDE/Ln6V47r9UztnA6DsJJyepz9ye9fRPi2iW/bKMMH9q8d9pPY25aD3cbQ2FEzBOP5CtzrPSZrkCZqSp3rNkc1te5roywZNTZfWtkdaWd5E+tBNwAB6/1ipi6KULz9IrCcmoHQ8CPSoXTPFRH+fb+1YTFAG/xmk9tOXDNDcUAAtM202jPMz9qjaSM1PdkT1mgk70u9yiXOKWigYtOZq30F8pctuDlHVp9ARI+omqjTjIpwvDfag9xa0DUjaEUvZvblUjjaD+KK96BXm8XfSd+3NRSwFGKK5qDvUxdK3COKROmk01qAZFRFsip4k6KnSisojXKynprat5qcUsHqSXuBXZ5oZVa3b5rRg9a2sd6Am/NSAmoytbDngcUrUGXiKKmKAoM0QCphowY1O2xBoYkD1rEJNX2atE1IC9zwKNf0quoDAEHkGqP3hBHJq20+rkjd9Kv1PjiP4i+zlv8A4f3lu2A9uPhEeQTuH05+leSmvpTXWA6srZDAgj0Ig/ivCPazwI6W+U5RhuQ+hPB9RWub+ksUqev1+tKahNuOlNO+3P8AnWg6kSJrSFgc1LfUksE/af2/rXQ+G+zLu+08Sn/uYj9lapbIsig97WFq7dvYwlUgZl5+W4gVXWPZFyTuwIMfOVVfyfwazOot5c1btM8hQSQCcelFOhcFgVMrzjjpXp+l9mVQbQuSgLH1HuzE+u1j9at9T4cha8xUS4RZjpbVST/L1p5GPFtkSD0x+aD+3Sr7xjwR7a7ypAM/cEyP87VR1qXUsxoCaA6ZponFAjNVBbK0SJNaQQKIDn6UV6/4a6+5QzPlEfKMfjH0ovv8cGqb2WTfYRixxKgdMVcmQsfmuVntrfTGuGeKG7wc1hQ/qwaHeYDn5VNXEXcHigXWaeamOSAaD7uT8VS/CfQ2b0rVS2GtVPGNeR+wZFTSKU98eAOKE7qTliDXT44/Vq92BUrNyc8VXWLgMkGRxmmUMRzT6p0p9qOhpRbnrRPeZWOtQNb8TWBiaFI45PpRrTx5eKAqJPNTAih7sxOKmh9ZrQJIn0rSXRPXFYvNYWM44rIc0+qPGTSftJ7N2taihpVlMhhyO4+WaKL+3jPoKc8Kvli0gjg5rRrzjxX+FT82b89ldfl+pfr0qfhf8MNjbrtzeD+kLA+816rFYyiKW0eTeI+xYsXUVJNtwQs8q0p5Z6jqPrXZaDwlVbdHaP8AtDR/8zVzqLQ7T1HzHFA94cgjbFZsNQNlRjFLvpUwQAI/v/U0dFkzPNAuADGyTyDNF0RLPMxn9oitFAscEjJ9aFdIA3ksJxFQZYGQe89xRQ9aLF1QrQGnAicmRx9TXk/tv4AdNqDAi25JTtOCy/QzXqo0yE7wD5e3ep+L+D29XZ924gzuXupgiZ+tObfpc+PAWWodjV/7Rez76V9r5XG1wMGRMehqguV1l1k0OK0o4oVtvtU7KktAoPVvZG4p0yDrmcdqtisIZIGcA81z3sxqzbtLacQwMzH6WEg/vXSqPLugNPeud9hB3JInNC1KY2xE59aXuX2DFQIPSf5UC7qXVgbq7sYjFY2N5aM6CMkiO3WhXUG4GCI/NK6nUkCZ5/FAfUkwxcGBJANKsmLaayqF/FRPxisqbf43kW1psbpGfWiLDQeeelVpYMF2AgwJAMA96L74oY3gL3OIn581twWYfHAFTV/XJqssNP6yT/f8UwmoaTj5Yn6UForx06fepLDQetV9pzA3d+3ftTVt2GW+5xFAygKtuJ46UU3GxJX5zmlluyCB06zz6iipEAkjHy5rQaTpx9+adbb0gY4qq/4gLJYSSMYkD19DUWV2CkPCg5gDzffj6VkWyjkdfvW+3SaXsXBE/CfvQtTqwi7skjlRkn5CirBpHGYqw8LB3kk4jjtkf3qg0Wr3/GjqQc7v6cVe+EOm5wvICk98zE1dRaMKGv3qTmg7ozVRDWXQonJHpVc10OC4EnMLxu+9G15DGM+sGPz9aEHXrnpOMfepTA7jXAohRPJn9hU7Nx2y6gZxBxQxrbZML5swTvH1IA564oZZSdodjBPcGe3apqm9Sd6sWAG3jB4+nNI2da+zNuRHJx+In6Uca1BKy0zGFJj5n+9CveceRys8kGWEdgcUBdbdfZCFFmJIBJ+1bVivXdjkYJPXFQtaa6AJubhzkLujsQv8qU1XiRtBt+5omSEiB0iZLfSro34jp0vIyXFUqwiD8u/Qjn6V5D7Qezb2i72zvtKYLD4kk4DjsejcH0r1S94xZKLuyDySDI3CQCAKlY0ltLgBUbLw2OpEqytgYI5BP71J179NZ/XhKmBXV+xfg5vOWjAH9v51P2p9jLtm+y2rbvaY7rZVS+0TlSR2JrvPYHwr3WmQkQz+cgiCN2QI6Yit2srXW6JE2NA+HYYHbgfk1X3n7HaOhc49Zq28ecBUGJzAPy5jrXK+9DOm/a4nIAzmQIXpHXM1i/TQ7yMTuzj/AEwSc9Kxiz4cnOAGgH5TU9VcIgKuIaSJVie0kf5FUr3iJJQvmMyNpxwRg9pmpjUpjX2Ewp2k9ckx6etJtpVThT5hMiIiO1F2DEKd0cboPHrzzQrkFYfcCDtGSR26c4obSw2f9FD64zWUD3FoY7epFZVBV1LqGAVWzwIBUdZJ4NGsaFXGPOAJKnMT3b0zVcdx8waQBMHIjrjt86lautbHkeD2Bj8RmjJ+xb2knyhI5Eye2aZXUIGklyYEDzR/4iJ+dVtnUEAl3PQwqwAM5IP+Z4odzWhoVl7EM0cA/wCkiQD86Ge3RjxVfhPyBZXgHoOgoiarzbfiaJ4O38niuePiKKPKME4I8uDiB1/lTz620CEjc4GZ2kDvn7emaLi5XVESIUNzBmQOJG7BGRTIuwnmIBOAQQp9TnGPWqNNVsCgK8PnyIGHyJEVtL5PnG9o5jjuAFb6T1p7LFzb1jhiAhbiGDDODzTi6o7gCkYn4hPriM1z9zUllkowdciCFkHgkiaf1N5HRAodLkKTHmyDnzESe+MweKGLlNShdkUMsDlxB+QJiaxLu3hpzkk47jB+dUu0mF3bscrtBk/6tw45+GK0lvBAcgEA4k7STJIDyCD2M4qUmLu5qNwgXQSOqkMPqV4PGDVv7Pbi7k8DAMZM+v0aq7wrQ+8TduG1hAlIOMdAo5npXQeF6VbSbVAySzEDbLHrHyA5qyUpy42IpfUagKCJAMdf6dqV8a1QS2XLBRgSSAMmOT865jX6wMAu5iwhSQATBiBuMiTHf9NW3EzVs+oO7c+0BjGNwMxiDPf0oLwSyo4cmRkhgMZBGB+5qte+FDSsrAJJXcFExk9JziDNSsXH5kNHnB95sicZgQRBPPUCsrjb+GJvDuy+RSAFhTJ6SAAF57fOtnSvavI9tC5ZRhmbYoXmDDFzEdQKJ7tlzuc/pjyy05B3CAIkcmaFf8vmcKG4JLmPLMRjAIPMYnrTDRE1FyQ91kQfqCSFkkgEFok/KmRcAmACFy0jMcgzwOPWqi5qdRMlwkKwDKS23cNoEFR85zgfKh6Vt6lb03CPMD7xnU4PIHPPED+sXNXqXXKhrTjcILAZ8pzAj0I/fFB1Ch//AFEOR36T1JA9K5fVsrFXUNbZWwWZlkgbZG0zJx+njnpT9+7dxKKZBDEO5VlSIKsQDBJ6DmJNVMW+t2sjAlVMqEGHAbBEBT9cgQKFpbJQh/fM+0AHf5MHzQFKifpSVrxBS2WZcQYELAOILcmYEzGTVj4b4K90i47sEOVSBMHmYJCz5vXPypg65BKg9wD+KQXDEVYkgDsOPlXEeIeNMrF1DEDpnPmWfmYHEjmrUR9pbrPc2qVGxQwLTBkfDI4B49fpVLavELtdUV0xC7yp7ENHmBz1qGvvsWVvMCSCoNxhgHAhTk7dwj+1U73FDmA4cmSd05H6mP8Aen1ZFz/zQJCyuQVY5B6mDkzOCO1VruBChC7kfFKhBjoeSY9DTi6h7iNFxcAhlY+aOCeT/hqvDOqqHA2/pMcdFEnpHzpioal3RoQF8CScR3EGMetbu6oEjy8A/wC0xMkkR1xzRblxFtllcZBOxQCTkDJ46fSlneSrFwcBhPqeuDJwBTArdsySYOfU/wBKyptdPdfsv/1rKbQsmp2gKCVPUzz2xGPzzWnujHB7tOT84P8AKhpaE/Dk9B2+tb2AGDjEmSB/nOaAy2wfhhcmIEA46mYps2YgHLeoBI7zGYqvF1RkusjI27mJx3mKYtXy23cSfXM57cx/agYS2mWcLA7Lkye8woyOKmiQZRbeOjCSZwGESODMY461BHMyZI6cEGY5DDiYpm1cHB2wehwBkicYGZqwpvT3GJgBAJmAu0mQZggkDt1rLt0blErPOSDEdFAUzx+OKUQoSGaCeBt6c+ueJn0oiIhgbVMEsCy5n15JOecVDBFVC5dgd4BI3MwUcg7oML6Cc9qKXQkMotqTkMoDZGIlhux9vrWBVjaw+kHjiRx60UWUIwoxMHHzicxUxfSegupum5cLESwIt8kcAgcfWiaWACzGJB/TIAPEnJJyPtNAfSqqhiZXurTnkTmYpi24UYKbo6kkiR/pjb2xM4p7S4vPBfF1Rdrsx6D4doyeIAJ49YBHWrGz7RAyWRgv6THxA9Y5EY5rlkvkNtMcY4APSfikDzRxR7d0jBKifhBORz0EdsCr7Mi08V8Qa6rIAyg+nP1iII7TzVZpvDWhsoDOSvGY7Ddx6j060MXAHVSbnmHmaFgTiIJkfPMD70xd8OAYMbjMQB8JaODjoDz2pn9PjZTzm0GXcAoIRQqwVG4kdTBH3+dFul/dsjFNwOH8ktzgnYcQIgqahb0QXKhyWkHd0B5ZmLCYAAAEmntPpNpncCTnCEQTno2cgc9qSQV7WAyEu+DAIe6V3GeYQCPpt+VT2s7SpVSRAO94ZUwSJwvPzjMYEPDTGZ3r1nam1jPqWPr+KktgAbCJnuZYzzIAgT6Vfp8Ib32qFdFRgCsKG4IJJEZHy6x6Um9wIW33WkGYQE5YZGTCLDZAHXirw6MEBTAYCAzMRHMdYHJ+mKrbl1UdkyB+qQ0HgYPUZFMTY1aKnb/zAcH9AIlREFl5iOAenWs06b0xc3ziVDRtJ6sYOJ6HEekVoXvKD71EEqI93ESfKBLYjbnAxNLo6uxVyHI5KkgSTK8TuGeN0ACpYMu6K4pXZkKQDAB46yTOB9RzmrxvHXQMiIiqCQhLZGAQGUmSTnj055qmOmUAqLm4RA2kAHrEnP2pPU2SjAEscqPi69RggwZgEgU+Kvtb7Q3CpXCPtGQrMN0xuJjaq9wT9etUdzujo0EKwDBVgnMLMbvzzWktPsIDxumZQEjcPhVsCOxz1zioXbDySNsf6ShYyM4YkA56mePpTNTcA/4a0SSvIMkpcLL2jarjOPT60tqfEFtc2SyE7pAEweNywAPrn50PU6fZBe43ECTuz1ENgcDuPWk7ukZfOGJDHbliQQZ7AE8YitIJc8UF1twASFhQQGIMEsYiMj5wBOKils4AO0N0MMD1kGATxwBx+AXlONkbl7/ERHHXEVB3vMDiCZiNsQBnHpmsqJdRVYrKuBkNkDg8jk9fSgXXwMx2CkAfKIBE4571tkYwMAqIOG+XUxnngClnLcAg9MH/AD70Gff7j+tZWbh/+mT9aytAe4Tnoeg/vW0s7z5ATHMwPl1rVZWV/Sa25nyjBg/WiKjBtoA7cDpHGflWVlaiGVuEAZIKkEHmOmM4orXP1AkmD8XfqcDvNZWVlU7F0kbQwDEzkNHU5I/pRLOVB8sghSBM5yIlY71lZQGypjaFIMdCY55ETwDzRWO0qJbiY7jnOf8AaTWVlBhZswxWeYggwYkjvH7UcPwSTIJHTMzBAGJ45rKygMnmUwrCIU+YY5E8mefwKYFtlk8rgALgDHABMSCOYrKyhRrl5gFJ8oyCSZYEcQoG3vSl3XNZaGa4d2RLA44mf8+VbrKfpIImoFwgi7dUjkCADHM89/xR7lxR5nLng/G/SIwDx6VusorV7XEx+kFgqmWyechehigazxHYQGcqSIUAFhk5yR+9ZWVYh69ZYAOS20Z2BhvJ5PmwNuOJFV9zxO2VMFhiWBUHvHXkRiMYrKyl+H7D1Ko10M26SoAAMDHBaO/pUWZww8mQIkNywwJk8VlZUvw/Ya3iFi44JBUKACSdx3EFiO0gZxNM3tWoBKAtHxSescqCBBrKyhVet/c64kCCF+IeoyRAz69ahrdYYWfgViAFG0Z6YIP3msrKp/SWu2i4RGRAnkzzImRS+6CIPJx35/asrKVIjqLJ+J1GMQDPPYcDvULLGOWUL2ifuD2msrKitXZiSAJBE95yJAk80vcQCOPWJz85rKytIksdj+KysrKg/9k=",
        imageContentType: "image/jpeg",
    };
    const image = `data:${dog.imageContentType};base64,${dog.image}`;

    const commonIconProps: TablerIconsProps = {
        style: { marginRight: "0.5rem" },
        stroke: 1.5,
    };

    return (
        <PageContainer>
            <Box sx={pageContainer}>
                <Box sx={contentWrapper}>
                    <Box>
                        <Typography
                            sx={{ fontSize: { xs: "2rem", md: "3rem" } }}
                            color={theme.palette.text.primary}
                        >
                            {AppTexts.dogDetails.title}
                        </Typography>
                    </Box>
                    <Box sx={actionBtnWrapper}>
                        <Button
                            size="large"
                            variant="contained"
                            sx={actionBtnStyle}
                            onClick={() => navigate(AppRoutes.root)}
                        >
                            <IconArrowLeft {...commonIconProps} />
                            {AppTexts.dogDetails.backButton}
                        </Button>
                        <Button
                            size="large"
                            variant="outlined"
                            sx={actionBtnStyle}
                            onClick={() => navigate(AppRoutes.root)}
                        >
                            <IconPhoneCall {...commonIconProps} />
                            {AppTexts.dogDetails.hamalButton}
                        </Button>
                    </Box>
                </Box>
                <Box sx={fetchedDataContainer}>
                    <CardMedia
                        image={image}
                        component="img"
                        style={{ objectFit: "contain" }}
                        title="Dog Image"
                        sx={{
                            height: "inherit",
                            width: { xs: "100%", md: "auto" },
                        }}
                    />
                    <Box component={"div"} sx={detailsStyle}>
                        <Box sx={detailsListStyle}>
                            <Box sx={advancedDetailsRowStyle}>
                                <span>פרטים נוספים: </span>
                                <span>
                                    {" "}
                                    מילה מילה מילה מילה מילה מילה מילה מילה ה
                                    מילה מילה מילה מילה מילה מילה מילה מילה מילה
                                    מילה מילה ה מילה מילה מילה
                                </span>
                            </Box>
                            <Box sx={detailRowStyle}>
                                <span>מין: </span>
                                <span>זכר</span>
                            </Box>
                            <Box sx={detailRowStyle}>
                                <span>נמצא באיזור: </span>
                                <span>ניר עוז</span>
                            </Box>
                            <Box sx={detailRowStyle}>
                                <span>דווח בתאריך: </span>
                                <span>10.10.2023</span>
                            </Box>
                            <Box sx={detailRowStyle}>
                                <span>גזע: </span>
                                <span>לברדור</span>
                            </Box>
                            <Box sx={detailRowStyle}>
                                <span>מספר שבב: </span>
                                <span>לא ידוע</span>
                            </Box>
                            <Box
                                sx={{
                                    display: { xs: "block", md: "none" },
                                    height: "5vh",
                                }}
                            />
                        </Box>
                    </Box>
                </Box>
            </Box>
        </PageContainer>
    );
};

//#region Styles

const pageContainer = {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "4",
};

const contentWrapper = {
    display: "flex",
    flexDirection: {
        xs: "column",
        md: "row-reverse",
    },
    justifyContent: "space-between",
    alignItems: "center",
    gap: { xs: "2rem", md: "none" },
    width: "85vw",
    marginTop: "2vh",
};

const actionBtnWrapper = {
    display: "flex",
    flexDirection: {
        xs: "column-reverse",
        md: "row",
    },
    gap: "2rem",
};

const actionBtnStyle = {
    width: { xs: "85vw", md: "15rem" },
    height: { xs: "5vh", md: "5vh" },
};

const fetchedDataContainer = {
    display: "flex",
    flexDirection: { xs: "column", sm: "row" },
    alignItems: "center",
    gap: "3rem",
    marginTop: "10vh",
    height: "45vh",
    width: "85vw",
};

const detailsListStyle = {
    height: "100%",
    maxWidth: { xs: "85vw", md: "45vw" },
    direction: "rtl",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: "1rem",
};

const detailsStyle = {
    width: "inherit",
    height: { xs: "auto", md: "inherit" },
    color: "#ffff",
    fontSize: { xs: "1rem", md: "1.2rem" },
    fontWeight: "500",
    direction: "rtl",
};

const detailRowStyle = {
    display: "flex",
    flexDirection: "row",
    gap: "1rem",
};

const advancedDetailsRowStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
};

//#endregion
