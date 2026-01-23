# 🚀 QUICK START - Pi Domain Validation

## 📌 COPY THESE TO VERCEL NOW

### Environment Variables (Vercel Dashboard → Settings → Environment Variables)

```bash
PI_API_KEY
du1td5k3lptmqgl7327zwsdwqxczmizgrstgexfjshkqqso3qei8jzafqkyh3lv6

PI_API_URL
https://api.minepi.com

PI_MAINNET_VALIDATION_KEY
4b4607253bb473cc6f639c789430d9f3d2958be4462820c58e178d50fbf5174062d20e69be46d2119b5ab93ee3b8aa86961dab23876b0c549f7cde90de69fd0c

PI_TESTNET_VALIDATION_KEY
ba5b2c8e2d0652e73c66ad936020e055cc4da6c51d59d3c1d8d7ff413b5de30df55b2967497d2278d5ac37eccd01d3fc81f2ba73f127796266f3e1e23de87f70
```

---

## 🌐 DNS Settings (Your Domain Registrar)

```
Record Type: A
Name: @
Value: 76.76.21.21

Record Type: CNAME
Name: testnet
Value: cname.vercel-dns.com
```

---

## ✅ Deployment Checklist

- [ ] Push code to GitHub
- [ ] Add 4 environment variables in Vercel
- [ ] Add domains in Vercel (triumphsynergy.com + testnet.triumphsynergy.com)
- [ ] Update DNS settings
- [ ] Wait 10 minutes for DNS
- [ ] Redeploy in Vercel
- [ ] Verify in Pi App Studio

---

## 🧪 Test After Deploy

```bash
curl https://triumphsynergy.com/validation-key.txt
# Should return mainnet key (4b4607...)

curl https://testnet.triumphsynergy.com/validation-key.txt
# Should return testnet key (ba5b2c...)
```

---

## 📚 Full Documentation

- [README_VALIDATION_COMPLETE.md](README_VALIDATION_COMPLETE.md) - Complete guide
- [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Step-by-step instructions
- [PI_VALIDATION_SETUP.md](PI_VALIDATION_SETUP.md) - Technical details

---

**🎯 TL;DR:** Copy environment variables to Vercel → Add domains → Update DNS → Redeploy → Verify in Pi App Studio ✨
