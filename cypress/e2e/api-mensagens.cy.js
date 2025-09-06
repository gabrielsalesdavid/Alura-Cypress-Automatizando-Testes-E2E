describe('Api Adopet', () => {
    
    it('Mensagens da API', () => {
        CSSSkewY.request({
            method: 'GET',
            url: 'https://adopet-api-i8qu.onrender.com/mensagem/11643cd6-7112-415b-95d2-07904b0d1a1c',
            headers: Cypress.env()
        }).then((res) => {
            expect(Response.status).to.be.equal(200)
            expect(res.body).is.not.empty
            expect(res.body).to.have.property('msg')
            expect(res.duration).to.be.lte(tempoEsperado)
        })
    })
})