import chalk from "chalk"
import PromptSync from "prompt-sync"
import fs from "fs"

// ===================================================
const refresh_token = 1800 //detik
const delayRefresh = 1500 //rekomendasi 1500 detik untuk grow all, grow satuan 10 detik
//  ===================================================

const prompt = PromptSync()

const getToken = async (refToken) => {
    const url = 'https://securetoken.googleapis.com/v1/token?key=AIzaSyDipzN0VRfTPnMGhQ5PSzO27Cxm3DohJGY'

    const headers = { 
        'accept': '*/*', 
        'accept-language': 'en,en-US;q=0.9,id;q=0.8', 
        'content-type': 'application/x-www-form-urlencoded', 
        'dnt': '1', 
        'origin': 'https://hanafuda.hana.network', 
        'priority': 'u=1, i', 
        'referer': 'https://hanafuda.hana.network/', 
        'sec-ch-ua': '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"', 
        'sec-ch-ua-mobile': '?0', 
        'sec-ch-ua-platform': '"Windows"', 
        'sec-fetch-dest': 'empty', 
        'sec-fetch-mode': 'cors', 
        'sec-fetch-site': 'cross-site', 
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36'
    }

    const payload = `grant_type=refresh_token&refresh_token=${refToken}`

    while(true) {
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: headers,
                body: payload
            })
            
            if(!response.ok) {
                throw new Error(`${response.status} ${response.statusText}`)
            }
    
            return await response.json()
        } catch (err) {
            console.log(chalk.red(`❌ Error get token: ${err.message}`));
            await new Promise(resolve => setTimeout(resolve, 2000)) // blocking/pause for 2 seconds
        }
    }
}

const getUser = async (token) => {
    const url = 'https://hanafuda-backend-app-520478841386.us-central1.run.app/graphql'

    const headers = {
        'accept': 'application/graphql-response+json, application/json',
        'accept-language': 'en,en-US;q=0.9,id;q=0.8',
        'authorization': `Bearer ${token}`,
        'content-type': 'application/json',
        'dnt': '1',
        'origin': 'https://hanafuda.hana.network',
        'priority': 'u=1, i',
        'referer': 'https://hanafuda.hana.network/',
        'sec-ch-ua': '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36'
    }

    const payload = JSON.stringify({
        query: `query CurrentUserStatus {
            currentUser {
                depositCount
                totalPoint
                evmAddress {
                    userId
                    address
                }
                inviter {
                    id
                    name
                }
            }
        }`,
        variables: {}
      })

    while(true) {
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: headers,
                body: payload
            })
    
            if(!response.ok) {
                throw new Error(`${response.status} ${response.statusText}`)
            }
    
            return await response.json()
        } catch (err) {
            console.log(chalk.red(`❌ Error getting user: ${err.message}`));
            await new Promise(resolve => setTimeout(resolve, 2000)) // blocking/pause for 2 seconds
        }
    }
}

const getGardenUser = async (token) => {
    const url = 'https://hanafuda-backend-app-520478841386.us-central1.run.app/graphql'
    
    const headers = {
        'accept': 'application/graphql-response+json, application/json',
        'accept-language': 'en,en-US;q=0.9,id;q=0.8',
        'authorization': `Bearer ${token}`,
        'content-type': 'application/json',
        'dnt': '1',
        'origin': 'https://hanafuda.hana.network',
        'priority': 'u=1, i',
        'referer': 'https://hanafuda.hana.network/',
        'sec-ch-ua': '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36'
    }

    const payload = JSON.stringify({
        query: `query GetGardenForCurrentUser {
            getGardenForCurrentUser {
                id
                inviteCode
                gardenDepositCount
                gardenStatus {
                    id
                    growActionCount
                    gardenRewardActionCount
                }
                gardenMilestoneRewardInfo {
                    id
                    gardenDepositCountWhenLastCalculated
                    lastAcquiredAt
                    createdAt
                }
                gardenMembers {
                    id
                    sub
                    name
                    iconPath
                    depositCount
                }
            }
        }`,
        variables: {}
    })

    while(true) {
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: headers,
                body: payload
            })
    
            if(!response.ok) {
                throw new Error(`${response.status} ${response.statusText}`)
            }
    
            return await response.json()
        } catch (err) {
            console.log(chalk.red(`❌ Error getting user garden: ${err.message}`));
            await new Promise(resolve => setTimeout(resolve, 2000)) // blocking/pause for 2 seconds
        }
    }
}

const executeGrow = async (token, withall) => {
    const url = 'https://hanafuda-backend-app-520478841386.us-central1.run.app/graphql'
    
    const headers = {
        'accept': 'application/graphql-response+json, application/json',
        'accept-language': 'en,en-US;q=0.9,id;q=0.8',
        'authorization': `Bearer ${token}`,
        'content-type': 'application/json',
        'dnt': '1',
        'origin': 'https://hanafuda.hana.network',
        'priority': 'u=1, i',
        'referer': 'https://hanafuda.hana.network/',
        'sec-ch-ua': '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36'
    }

    const payload = JSON.stringify({
        query: `mutation ExecuteGrowAction($withAll: Boolean) {
            executeGrowAction(withAll: $withAll) {
                baseValue
                leveragedValue
                totalValue
                multiplyRate
            }
        }`,
        variables: {"withAll":withall}
    })

    while(true) {
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: headers,
                body: payload
            })
    
            if(!response.ok) {
                throw new Error(`${response.status} ${response.statusText}`)
            }
    
            return await response.json()
        } catch (err) {
            console.log(chalk.red(`❌ Error to grow: ${err.message}`));
            await new Promise(resolve => setTimeout(resolve, 2000)) // blocking/pause for 2 seconds
        }
    }
}

const executeDraw = async (token, limit) => {
    const url = 'https://hanafuda-backend-app-520478841386.us-central1.run.app/graphql'
    
    const headers = {
        'accept': 'application/graphql-response+json, application/json',
        'accept-language': 'en,en-US;q=0.9,id;q=0.8',
        'authorization': `Bearer ${token}`,
        'content-type': 'application/json',
        'dnt': '1',
        'origin': 'https://hanafuda.hana.network',
        'priority': 'u=1, i',
        'referer': 'https://hanafuda.hana.network/',
        'sec-ch-ua': '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36'
    }

    const payload = JSON.stringify({
        query: `mutation executeGardenRewardAction($limit: Int!) {
            executeGardenRewardAction(limit: $limit) {
                data {
                    cardId
                    group
                }
                isNew
            }
        }`,
        variables: {
            "limit": limit
        }
    })

    while(true) {
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: headers,
                body: payload
            })
    
            if(!response.ok) {
                throw new Error(`${response.status} ${response.statusText}`)
            }
    
            return await response.json()
        } catch (err) {
            console.log(chalk.red(`❌ Error to draw: ${err.message}`));
            await new Promise(resolve => setTimeout(resolve, 2000)) // blocking/pause for 2 seconds
        }
    }
}

const runCreateToken = async () => {
    console.log(`🤖 Access token sedang dibuat`)
    try {
        // read accessToken.txt
        const data = fs.readFileSync('accessToken.txt', 'utf-8');
        const accessTokens = data.split('\n')

        // get token ***GATHER BOOMMM!!!!!
        const tokens = []
        for (const accessToken of accessTokens) {
            if (accessToken != "") {
                const acctoken = await getToken(accessToken) 
                const token = acctoken.access_token

                tokens.push(token)
            }
        }

        // buat file tokens.txt
        fs.writeFileSync('tokens.txt', "")
        
        // read tokens.txt
        const token = fs.readFileSync('tokens.txt', 'utf-8');

        // append token to token.txt
        for (const token of tokens) {
            // console.log(token)
            fs.appendFileSync('tokens.txt', `${token}\n`)
        }

        console.log(`${chalk.green(`✅ Access token berhasil dibuat`)}\n`)
    } catch (e) {
        // jika accessToken.txt not exist
        if (e.code == 'ENOENT') {
            console.log('📝 Fill the accessToken.txt first!');
            fs.writeFileSync('accessToken.txt', "AMf-xxxxxx\nAMf-xxxxxx\netc...")
            console.log(`${chalk.red(`❌ Access Token gagal dibuat`)}`)
            process.exit()
        } else {
            throw e
        }
    }
}

const timeCount = async (waktu) => {
    for (let i = waktu; i >= 0; i--) {
        // inisiasi menit dan second
        let minutes = Math.floor(waktu/60)
        let seconds = waktu % 60;

        // jika menit dan second < 2 digit
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;

        // BOOMM tampilkan ******
        process.stdout.write(`⏳ Delay ${chalk.yellow(`${minutes}:${seconds} menit`)} `);
        
        // increament - 1
        waktu = waktu-1;

        // blocking delay untuk satu detik
        await new Promise(resolve => setTimeout(resolve, 1000))

        // clear last console log
        if (waktu >= 0) {
            process.stdout.clearLine();
            process.stdout.cursorTo(0); 
        }
    }
}

(async () => {
    console.log(`🌱 Hanafuda Auto Grow & Draw Bot 🌱\n`)

    await runCreateToken()

    let pilihan = null
    while(true){
        console.log(`[1] Grow satuan\n[2] Grow all`)
        let userPilihGrow = prompt(`↪ Silakan pilih opsi grow: `)
        if (userPilihGrow == 1) {
            pilihan = false
            console.log(`${chalk.green(`🚀 Anda memilih grow satuan`)}`)
            break
        } else if (userPilihGrow == 2) {
            pilihan = true
            console.log(`${chalk.green(`🚀 Anda memilih grow all`)}`)
            break
        } else {
            console.log(`${chalk.red(`❌ Pilihan anda tidak tersedia`)}`)
            process.exit()
        }
    }

    let sekarang = Math.trunc(Date.now()/1000)
    let nanti = Math.trunc(Date.now()/1000) + Number(refresh_token)

    while (sekarang < nanti) {
        // open tokens.txt
        const data = fs.readFileSync('tokens.txt', 'utf-8')
        const tokens = data.split('\n')

        for(const token of tokens) {
            if(token!="") {
                // user
                const user = await getUser(token)
                if(user.data!=undefined) {
                    const evmuser = user.data.currentUser.evmAddress.address
                    const poinuser = user.data.currentUser.totalPoint

                    console.log(`\n🔑 EVM address: ${chalk.green(`${String(evmuser).slice(0,5)}xxxxx`)}\n🏆 Total poin: ${chalk.yellow(Number(poinuser).toLocaleString('en-US'))}`)

                    // garden
                    const garden = await getGardenUser(token)
                    const numberdeposituser = garden.data.getGardenForCurrentUser.gardenDepositCount
                    const growtersediauser = garden.data.getGardenForCurrentUser.gardenStatus.growActionCount
                    const drawtersediauser = garden.data.getGardenForCurrentUser.gardenStatus.gardenRewardActionCount

                    // grow
                    console.log(`🏦 Jumlah deposit: ${chalk.yellow(numberdeposituser)}\n📈 Grows tersedia: ${chalk.yellow(growtersediauser)}`)
                    
                    if (growtersediauser>0) {
                        console.log(`${chalk.green(`🟢 Grows tersedia, sedang mengeksekusi`)}`)
                        const grows = await executeGrow(token, pilihan)
                        // console.log(grows)
                        const totalval = grows.data.executeGrowAction.totalValue
                        console.log(`💰 Poin diperoleh: ${chalk.yellow(totalval)}`)
                    } else {
                        console.log(`${chalk.red(`🔴 Grows sedang tidak tersedia`)}`)
                    }

                    // draw
                    console.log(`🃏 Grows tersedia: ${chalk.yellow(drawtersediauser)}`)
                    if (drawtersediauser>10) {
                        console.log(`${chalk.green(`🟢 Draws tersedia, sedang mengeksekusi`)}`)
                        const draws = await executeDraw(token, 10)
                        // console.log(draws)
                        const totalval = draws.data.executeGardenRewardAction.length
                        console.log(`💰 Jumlah kartu diperoleh: ${chalk.yellow(totalval)}`)
                    } else if (drawtersediauser <= 10 && drawtersediauser > 0) {
                        console.log(`${chalk.green(`🟢 Draws tersedia, sedang mengeksekusi`)}`)
                        const draws = await executeDraw(token, drawtersediauser)
                        // console.log(draws)
                        const totalval = draws.data.executeGardenRewardAction.length
                        console.log(`💰 Jumlah kartu diperoleh: ${chalk.yellow(totalval)}`)
                    } else {
                        console.log(`${chalk.red(`🔴 Draws sedang tidak tersedia`)}`)
                    }
                }
            }
        }

        console.log()
        // printed and blocking
        await timeCount(Number(delayRefresh))
        console.log()

        sekarang = Math.trunc(Date.now()/1000)
        if (sekarang >= nanti) {
            console.log("🤖 Refresh akses token dimulai")
            await runCreateToken()
            nanti = Math.trunc(Date.now()/1000) + Number(refresh_token)
        }
    } 
})()