const samples = ['0112342523', '01012345678', '013-234-5678', '010-1234-5678']

String.prototype.phone_mask = function () {
  const ret = this.replace(/-/g, '')
  if (/^01[1679]{1}[0-9]{3}[0-9]{4}$/.test(ret))
    return ret.replace(/(\d{3})(\d{3})(\d{4})/gi, '$1***$3')
  else if (/^010[0-9]{4}[0-9]{4}$/.test(ret))
    return ret.replace(/(\d{3})(\d{4})(\d{4})/gi, '$1****$3')
  else return ret
}

samples.map((s) => console.log(s.phone_mask()))
