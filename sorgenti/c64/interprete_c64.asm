; Interprete per Commodore 64, passo 4: a capo automatico delle parole, frammenti di descrizione.
; Licenza MIT. Assemblato con asm6502.py; il compilatore aggiunge il font a $2000 e i dati del gioco a $2400.
; Memoria video (banco 3): testo a $C800, font a $D000 (RAM sotto l'I/O, con il negativo a $D400),
; immagine: bitmap a $E000 e colori a $CC00 (piu' la RAM colore), mostrata in alto con un interrupt di raster.
;
; Intestazione dei dati (a $0C00):
;   +0 stanza iniziale (byte)      +1 numero di stanze (byte)
;   +2 tabella testi delle stanze  (2 byte per stanza)
;   +4 tabella delle uscite (8 byte per stanza, 0 = nessuna, altrimenti stanza+1)
;   +6 vocabolario                 +8 tabella dei testi dei messaggi
;   +10 numero di oggetti (byte)   +11 libero    +12 tabella degli oggetti
;   +14 regole   +16 tabella delle uscite con condizioni   +18 nomi delle direzioni   +20 numero di direzioni (byte)
; (intestazione ora di 30 byte: +24 tabella valori iniziali variabili, +26 numero variabili, +28 parole degli oggetti)
;   +22 tabella dei frammenti di descrizione (un puntatore per stanza, 0 = nessuno): [n][{[n cond][cond...][testo (2)]}...]
; Uscita nella tabella: 0 nessuna, 1..127 = stanza+1, $80+k = uscita con condizioni numero k
; Oggetto (16 byte): posizione iniziale, flag (1 = prendibile, 4 = non in elenco finche' sta dov'e'), poi coppie di puntatori
; etichetta, descrizione, etichetta aperto, descrizione aperto, etichetta acceso, descrizione acceso (0 = non c'e')
; Posizione: numero di stanza, $80+k = dentro l'oggetto k, $FE = con te, $FF = da nessuna parte
; Flag: 8 = contenitore, 16 = si apre e si chiude (il contenuto si vede solo da aperto)
; Vocabolario: [lunghezza][lettere...][tipo][id] ... 0   (tipo 1 = comando, 2 = direzione, 3 = parola ignorata (id 1 = preposizione), 4 = nome di oggetto, 5 = aggettivo)

CHROUT = $FFD2
GETIN  = $FFE4
PLOT   = $FFF0
HDR    = $2400
FONT   = $2000
; puntatori in pagina zero liberi (BASIC non gira): immagine e destinazione
IP     = $22
DST    = $24
LINE   = $0340
WORD   = $0370
P1     = $FB
P2     = $FD
P3     = $F7
RP     = $F9
room   = $C000
verb   = $C001
dirv   = $C002
wlen   = $C003
wtype  = $C004
wid    = $C005
tmp    = $C006
lpos   = $C007
nwords = $C008
llen   = $C009
obj    = $C00A
cnt    = $C00B
idx    = $C00C
lsloc  = $C00D
lspre  = $C00E
seen   = $C00F
obj2   = $C012
robj   = $C013
robj2  = $C014
fin    = $C015
rn     = $C016
rok    = $C017
ry     = $C018
dsel   = $C019
xst    = $C01A
xtgt   = $C01B
xnas   = $C01C
xbp    = $C01D
xrp    = $C01F
ostate = $C0C0
col    = $C030
wlen2  = $C031
tmpc   = $C032
fc     = $C033
wvis   = $C034
ocv    = $C035
xk     = $C036
; i testi nei dati sono rimescolati: byte XOR una chiave che parte da TKEY e cresce di TSTEP a ogni carattere
TKEY   = $A7
TSTEP  = $3B
; le lettere del vocabolario sono XOR VKEY
VKEY   = $55
WBUF   = $C140
objloc = $C040
vtmp   = $C037
vtmp2  = $C038
rmode  = $C039
lschar = $C03A
lsmul  = $C03B
lsfl   = $C03C
tai    = $C03D
tcnt   = $C03E
dtmp   = $C03F
fdark  = $C1D9
LAST   = $C2A0
; uscita a blocchi e pausa a schermo pieno
pch    = $C2D0
nlin   = $C2D1
dflag  = $C2D2
kwait  = $C2D3
kk     = $C2D4
frow   = $C2D5
skn    = $C2D6
skl    = $C2D7
skh    = $C2D8
tmpd   = $C2D9
BUF    = $C300
; immagini: itop = prima riga del testo (0 = nessuna immagine; sopra c'e' l'immagine e una riga nera), nrig = righe prima della pausa
itop   = $C2E0
nrig   = $C2E1
curl   = $C2E2
tout   = $C2E4
irqst  = $C2E5
imode  = $C2E6
ibg    = $C2E7
isplit = $C2E8
pcol   = $C2E9
prow   = $C2EA
px0    = $C2EB
ifill  = $C2EC
pcnt   = $C2ED
cpn    = $C2EE
pmul   = $C2EF
rsl    = $C2F0
rsh    = $C2F1
stl    = $C2F2
sth    = $C2F3
; oggetto del comando, per la sua immagine
fobj   = $C2F4
T_TASTO = 47
NRIGHE = 24
vars   = $C180
slots  = $C1C0
cs     = $C1C8
fscope = $C1C9
famb   = $C1CA
ffirst = $C1CB
fc0    = $C1CC
fc1    = $C1CD
ftot   = $C1CE
fi     = $C1CF
fm0    = $C1D0
fm1    = $C1D1
fx     = $C1D2
fnn    = $C1D3
fw     = $C1D4
fa0    = $C1D5
fa1    = $C1D6
pbase  = $C1D7
copen  = $C1D8
oflags = $C200

; id dei messaggi
T_NONCAP = 0
T_PRE    = 1
T_POST   = 2
T_DOVE   = 3
T_NOEXIT = 4
T_PROMPT = 5
T_INTRO  = 7
T_QUI    = 8
T_INV    = 10
T_INVVUO = 12
T_COSAPR = 13
T_COSALA = 14
T_NONPRE = 15
T_NONHAI = 16
T_GIA    = 17
T_NONPRN = 18
T_PRESO  = 19
T_LASCIA = 20
T_VIRG   = 21
T_E      = 22
T_USC    = 23
T_BLOCK  = 25
T_FINE   = 26
T_QUALE  = 27
T_DENTRO = 28
T_VUOTO  = 30
T_METTI  = 31
T_NONCON = 32
T_CHIUSO = 33
T_MESSO  = 34
T_PERS   = 35
T_NOPERS = 39
T_TEMPO  = 40
T_AIUTO  = 41
T_NIENTEPR = 42
T_NIENTELA = 43
T_COLTXT = 44
T_DUEP   = 45
T_BUIO   = 46
T_NIENTE = 6

        .org $080D
start:  lda #0
        sta $D020
        sta $D021
        jsr fontinit
        lda $DD00
        and #$FC
        sta $DD00
        jsr irqoff
        lda #$C8
        sta $0288
        lda #$C3
        sta pu_st+2
        lda #147
        jsr CHROUT
        lda #8
        jsr CHROUT
        lda #1
        sta $CC
        lda HDR
        sta room
        lda #0
        sta itop
        sta tout
        sta curl
        sta curl+1
        lda #NRIGHE
        sta nrig
        lda #0
        sta fin
        sta rmode
        sta lschar
        sta lsmul
        sta LAST
        sta col
        sta nlin
        sta dflag
        sta kwait
        sta pu_st+1
        sta wlen2
        sta wvis
        tax
cl1:    sta ostate,x
        inx
        bpl cl1
        sta idx
in1:    lda idx
        cmp HDR+10
        bcs in2
        jsr objptr
        ldy #0
        lda (P3),y
        ldx idx
        sta objloc,x
        iny
        lda (P3),y
        sta oflags,x
        inc idx
        jmp in1
in2:    lda #0
        ldx #63
iv0:    sta vars,x
        dex
        bpl iv0
        lda HDR+24
        sta P3
        lda HDR+25
        sta P3+1
        ldy #0
iv1:    cpy HDR+26
        bcs iv2
        lda (P3),y
        sta vars,y
        iny
        bne iv1
iv2:    lda #T_INTRO
        jsr prtext
        jsr flushw
        jsr flushb
        lda HDR+11
        and #2
        beq iv3
        jsr more
iv3:    jsr describe
        jsr events
main:   lda #T_PROMPT
        jsr prtext
        jsr flushw
        jsr flushb
        lda #0
        sta nlin
        jsr readline
        lda #0
        sta col
        sta tout
        lda fin
        beq mn1
        jmp start
mn1:    jsr execute
        jmp main

; scrive la parola in attesa (WBUF) andando a capo se non ci sta
flushw: lda wlen2
        beq fw_ret
        lda wvis
        clc
        adc col
        cmp #40
        bcc fw_p
        lda #13
        jsr putc
        lda #0
        sta col
fw_p:   ldx #0
fw_l:   lda WBUF,x
        jsr putc
        inx
        cpx wlen2
        bne fw_l
        lda col
        clc
        adc wvis
        sta col
        lda #0
        sta wlen2
        sta wvis
fw_ret: rts

; scrive il carattere A con a capo automatico tra le parole (colonne 0-38 usate)
outc:   sta tmpc
        txa
        pha
        tya
        pha
        lda #1
        sta ocv
        lda tmpc
        cmp #13
        beq oc_cr
        cmp #32
        beq oc_sp
        cmp #8
        bcs oc_ch
        tax
        lda coltab,x
        sta tmpc
        lda #0
        sta ocv
oc_ch:  ldx wlen2
        cpx #39
        bcc oc_add
        jsr flushw
        ldx wlen2
oc_add: lda tmpc
        sta WBUF,x
        inc wlen2
        lda wvis
        clc
        adc ocv
        sta wvis
        jmp oc_ret
oc_sp:  jsr flushw
        lda col
        cmp #39
        bcs oc_ret
        lda #32
        jsr putc
        inc col
        jmp oc_ret
oc_cr:  jsr flushw
        lda #13
        jsr putc
        lda #0
        sta col
oc_ret: pla
        tay
        pla
        tax
        lda tmpc
        rts

; copia il font del gioco (1024 byte a FONT) in $D000 (RAM sotto l'I/O, vista dal VIC nel banco 3)
; e ne prepara la versione in negativo a $D400 per il cursore; lo schermo va a $C800
fontinit:
        lda #<FONT
        sta P1
        lda #>FONT
        sta P1+1
        lda #0
        sta P2
        sta P3
        lda #$D0
        sta P2+1
        lda #$D4
        sta P3+1
        sei
        lda #$34
        sta $01
        ldx #0
fi_p:   ldy #0
fi_b:   lda (P1),y
        sta (P2),y
        eor #$FF
        sta (P3),y
        iny
        bne fi_b
        inc P1+1
        inc P2+1
        inc P3+1
        inx
        cpx #4
        bne fi_p
        lda #$37
        sta $01
        cli
        rts

; colori per tipo di testo (1 nome stanza, 2 testo, 3 oggetti, 4 uscite, 5 errori, 6 comando del giocatore)
coltab: .byte 155, 158, 155, 153, 159, 150, 5, 155

; stampa il messaggio con id in A
prtext: asl
        tay
        lda HDR+8
        sta P2
        lda HDR+9
        sta P2+1
        lda (P2),y
        sta P1
        iny
        lda (P2),y
        sta P1+1
; stampa la stringa che termina con 0 puntata da P1
prstr:  ldy #0
        lda #TKEY
        sta xk
ps1:    lda (P1),y
        eor xk
        beq psend
        jsr outc
        lda xk
        clc
        adc #TSTEP
        sta xk
        iny
        bne ps1
        inc P1+1
        jmp ps1
psend:  rts

; punta P3 al record dell'oggetto idx
objptr: lda idx
        sta P3
        lda #0
        sta P3+1
        asl P3
        rol P3+1
        asl P3
        rol P3+1
        asl P3
        rol P3+1
        asl P3
        rol P3+1
        clc
        lda P3
        adc HDR+12
        sta P3
        lda P3+1
        adc HDR+13
        sta P3+1
        rts

; carry acceso se l'oggetto idx va nell'elenco di lsloc
fits:   ldx idx
        lda objloc,x
        cmp lsloc
        bne fits_no
        jsr objptr
        ldy #1
        lda (P3),y
        sta lsfl
        lda lsloc
        cmp #$80
        bcs fits_f4
        lda lsfl
        and #32
        cmp lschar
        bne fits_no
fits_f4:
        lda lsloc
        cmp #$FE
        bcs fits_yes
        lda lsfl
        and #4
        beq fits_yes
        ldy #0
        lda (P3),y
        ldx idx
        cmp objloc,x
        beq fits_no
fits_yes:
        sec
        rts
fits_no:
        clc
        rts

; posizione effettiva dell'oggetto X: risale i contenitori; $FF se sta dentro un contenitore chiuso. Usa X e Y.
effloc: ldy #8
        lda objloc,x
el1:    cmp #$80
        bcc el_r
        cmp #$FE
        bcs el_r
        and #$7F
        tax
        lda oflags,x
        and #$10
        beq el2
        lda ostate,x
        and #1
        beq el_h
el2:    dey
        beq el_h
        lda objloc,x
        jmp el1
el_h:   lda #$FF
el_r:   rts

; se l'oggetto A e' un contenitore aperto, scrive che cosa c'e' dentro
showcont:
        tax
        lda oflags,x
        and #8
        beq sc_r
        lda oflags,x
        and #$10
        beq sc1
        lda ostate,x
        and #1
        beq sc_r
sc1:    txa
        ora #$80
        sta lsloc
        lda #T_DENTRO
        sta lspre
        jsr listobj
        bne sc_r
        lda #T_VUOTO
        jmp prtext
sc_r:   rts

; elenca gli oggetti che stanno in lsloc, col testo lspre prima e lspre+1 dopo; restituisce il numero in A (0 = nessuno, non stampa niente)
listobj:
        lda #0
        sta cnt
        sta idx
lo1:    lda idx
        cmp HDR+10
        bcs lo2
        jsr fits
        bcc lo1n
        inc cnt
lo1n:   inc idx
        jmp lo1
lo2:    lda cnt
        bne lo2b
        rts
lo2b:   lda lsmul
        beq lo2c
        lda cnt
        cmp #2
        bcc lo2c
        lda lspre
        clc
        adc #2
        sta lspre
lo2c:   lda lspre
        jsr prtext
        lda #0
        sta idx
        sta seen
lo3:    lda idx
        cmp HDR+10
        bcs lo_end
        jsr fits
        bcc lo3n
        lda seen
        beq lo_ns
        ldx cnt
        dex
        cpx seen
        beq lo_e
        lda #T_VIRG
        jmp lo_sep
lo_e:   lda #T_E
lo_sep: jsr prtext
lo_ns:  lda #2
        jsr getptr
        jsr prstr
        inc seen
lo3n:   inc idx
        jmp lo3
lo_end: lda lspre
        clc
        adc #1
        jsr prtext
        lda cnt
        rts

; carica in P1 il puntatore che sta a Y nel record P3; A = 0 se e' nullo
ldptr:  lda (P3),y
        sta P1
        iny
        lda (P3),y
        sta P1+1
        ora P1
        rts

; punta P1 al testo (A = 2 etichetta, 4 descrizione) dell'oggetto idx, secondo il suo stato
getptr: sta tmp
        jsr objptr
        ldx idx
        lda ostate,x
        and #1
        beq gp_a
        lda tmp
        clc
        adc #4
        tay
        jsr ldptr
        bne gp_ret
gp_a:   ldx idx
        lda ostate,x
        and #2
        beq gp_b
        lda tmp
        clc
        adc #8
        tay
        jsr ldptr
        bne gp_ret
gp_b:   ldy tmp
        jsr ldptr
gp_ret: rts

; byte successivo della regola o dell'uscita puntata da RP (cursore ry)
nextb:  ldy ry
        inc ry
        lda (RP),y
        rts

; valuta una condizione (3 byte: tipo, a, b); C acceso se vera
chkcond:
        jsr nextb
        bne cc_k
        jsr nextb
        sta tmp
        jsr nextb
        lda tmp
        cmp room
        beq cc_t
        jmp cc_f
cc_k:   jmp cc_kk
cc_obj: jsr nextb
        tax
        jsr nextb
        sta tmp
        cmp #4
        bcs cc_pos
        cmp #2
        bcs cc_lit
        lda ostate,x
        and #1
        jmp cc_bit
cc_lit: lda ostate,x
        and #2
cc_bit: pha
        lda tmp
        and #1
        beq cc_nz
        pla
        beq cc_t
        jmp cc_f
cc_nz:  pla
        bne cc_t
        jmp cc_f
cc_pos: jsr effloc
        ldx tmp
        cpx #5
        beq cc_con
        bcs cc_ap
        cmp room
        beq cc_t
        jmp cc_f
cc_con: cmp #$FE
        beq cc_t
        jmp cc_f
cc_ap:  cmp room
        beq cc_t
        cmp #$FE
        beq cc_t
cc_f:   clc
        rts
cc_t:   sec
        rts
cc_kk:   cmp #2
        bcc cc_obj
        sec
        sbc #2
        sta tmp
        jsr nextb
        tax
        jsr nextb
        sta vtmp
        lda vars,x
        ldx tmp
        beq cv_eq
        dex
        beq cv_ne
        dex
        beq cv_ge
        cmp vtmp
        beq cvt
        bcc cvt
        jmp cvf
cv_eq:  cmp vtmp
        beq cvt
        jmp cvf
cv_ne:  cmp vtmp
        bne cvt
        jmp cvf
cv_ge:  cmp vtmp
        bcs cvt
        jmp cvf
cvt:    sec
        rts
cvf:    clc
        rts

; legge il numero di condizioni e le valuta tutte; A diverso da 0 se sono tutte vere
evalconds:
        jsr nextb
        sta rn
        lda #1
        sta rok
ev1:    lda rn
        beq ev_end
        jsr chkcond
        bcs ev2
        lda #0
        sta rok
ev2:    dec rn
        jmp ev1
ev_end: lda rok
        rts

; informazioni sull'uscita dsel della stanza corrente: xst 0 = non c'e' (o e' nascosta), 1 = si passa (xtgt), 2 = bloccata (testo in xbp); xrp = testo di rivelazione
getexit:
        lda #0
        sta xst
        sta xrp
        sta xrp+1
        sta xbp
        sta xbp+1
        lda room
        sta P1
        lda #0
        sta P1+1
        asl P1
        rol P1+1
        asl P1
        rol P1+1
        asl P1
        rol P1+1
        clc
        lda P1
        adc HDR+4
        sta P1
        lda P1+1
        adc HDR+5
        sta P1+1
        ldy dsel
        lda (P1),y
        bne gx1
        rts
gx1:    bmi gx_c
        sec
        sbc #1
        sta xtgt
        lda #1
        sta xst
        rts
gx_c:   and #$7F
        asl
        tay
        lda HDR+16
        sta P2
        lda HDR+17
        sta P2+1
        lda (P2),y
        sta RP
        iny
        lda (P2),y
        sta RP+1
        lda #0
        sta ry
        jsr nextb
        sta xtgt
        jsr nextb
        sta xnas
        jsr evalconds
        pha
        jsr nextb
        sta xbp
        jsr nextb
        sta xbp+1
        jsr nextb
        sta xrp
        jsr nextb
        sta xrp+1
        pla
        beq gx_no
        lda #1
        sta xst
        rts
gx_no:  lda xnas
        bne gx_hid
        lda #2
        sta xst
gx_hid: rts

; stampa le rivelazioni e l'elenco delle uscite visibili
descexits:
        lda #0
        sta dsel
dx1:    lda dsel
        cmp HDR+20
        bcs dx2
        jsr getexit
        lda xst
        cmp #1
        bne dx1n
        lda xrp
        ora xrp+1
        beq dx1n
        lda xrp
        sta P1
        lda xrp+1
        sta P1+1
        jsr prstr
dx1n:   inc dsel
        jmp dx1
dx2:    lda #0
        sta dsel
        sta seen
dx3:    lda dsel
        cmp HDR+20
        bcs dx_end
        jsr getexit
        lda xst
        beq dx3n
        lda seen
        bne dx_sep
        lda #T_USC
        jsr prtext
        jmp dx_lab
dx_sep: lda #T_VIRG
        jsr prtext
dx_lab: lda dsel
        asl
        tay
        lda HDR+18
        sta P2
        lda HDR+19
        sta P2+1
        lda (P2),y
        sta P1
        iny
        lda (P2),y
        sta P1+1
        jsr prstr
        inc seen
dx3n:   inc dsel
        jmp dx3
dx_end: lda seen
        beq dx_ret
        lda #T_USC+1
        jsr prtext
dx_ret: rts

; aggiunge alla descrizione i frammenti la cui condizione e' vera
descfrag:
        lda room
        asl
        tay
        lda HDR+22
        sta P2
        lda HDR+23
        sta P2+1
        lda (P2),y
        sta RP
        iny
        lda (P2),y
        sta RP+1
        ora RP
        bne df1
        rts
df1:    lda #0
        sta ry
        jsr nextb
        sta fc
df2:    lda fc
        bne df3
        rts
df3:    jsr evalconds
        pha
        jsr nextb
        sta P1
        jsr nextb
        sta P1+1
        pla
        beq df4
        lda #32
        jsr outc
        jsr prstr
df4:    dec fc
        jmp df2

; stampa il testo della stanza corrente, gli oggetti presenti e le uscite
describe:
        jsr pic
        jsr isdark
        bcc ds_ok
        lda #T_BUIO
        jmp prtext
ds_ok:  lda room
        sta P1
        lda #0
        sta P1+1
        asl P1
        rol P1+1
        clc
        lda P1
        adc HDR+2
        sta P1
        lda P1+1
        adc HDR+3
        sta P1+1
        ldy #0
        lda (P1),y
        sta P2
        iny
        lda (P1),y
        sta P1+1
        lda P2
        sta P1
        jsr prstr
        jsr descfrag
        lda #13
        jsr outc
        lda room
        sta lsloc
        lda #T_QUI
        sta lspre
        jsr listobj
        lda #32
        sta lschar
        lda #1
        sta lsmul
        lda room
        sta lsloc
        lda #T_PERS
        sta lspre
        jsr listobj
        lda #0
        sta lschar
        sta lsmul
        jmp descexits

; ---- uscita del testo: a righe (come la ROM) o a blocchi, con pausa quando lo schermo e' pieno ----
; HDR+11: bit 0 = a blocchi, bit 1 = attesa di un tasto dopo l'introduzione.
; putc scrive il carattere A (conserva A, X, Y). A blocchi lo mette in BUF e conta le righe;
; flushb fa scorrere lo schermo una volta sola, di quanto serve, e poi stampa il blocco.
putc:   sta pch
        txa
        pha
        tya
        pha
        lda pch
        cmp #32
        bcc pu_t
        lda #1
        sta tout
pu_t:
        lda dflag
        bne pu_dir
        lda HDR+11
        lsr
        bcs pu_blk
pu_dir: lda pch
        cmp #13
        bne pu_d2
        ldx itop
        beq pu_d2
        ldx $D6
        cpx #24
        bne pu_d2
        lda #1
        sta kk
        jsr scrollk
        ldx #24
        ldy #0
        clc
        jsr PLOT
        lda #13
        bne pu_d3
pu_d2:  jsr CHROUT
pu_d3:  cmp #13
        bne pu_end
        lda dflag
        bne pu_end
        inc nlin
        lda nlin
        cmp nrig
        bcc pu_end
        jsr more
pu_end: pla
        tay
        pla
        tax
        lda pch
        rts
pu_blk: lda pch
pu_st:  sta BUF
        inc pu_st+1
        bne pb1
        inc pu_st+2
pb1:    cmp #13
        bne pb2
        inc nlin
        lda nlin
        cmp nrig
        bcc pb2
        jsr flushb
        jsr more
        jmp pu_end
pb2:    lda pu_st+2
        cmp #$C7
        bcc pu_end
        jsr flushb
        jmp pu_end

flushb: lda pu_st+1
        bne fb0
        lda pu_st+2
        cmp #$C3
        beq fb_r
fb0:    lda $D6
        clc
        adc nlin
        sec
        sbc #24
        bcc fb_p
        beq fb_p
        sta kk
        lda #25
        sec
        sbc itop
        cmp kk
        bcs fb1
        sta kk
fb1:    jsr scrollk
        lda $D6
        sec
        sbc kk
        bcc fb1b
        cmp itop
        bcs fb2
fb1b:   lda itop
fb2:    tax
        ldy $D3
        clc
        jsr PLOT
fb_p:   lda #1
        sta dflag
        lda #0
        sta fb_ld+1
        lda #$C3
        sta fb_ld+2
fb_l:   lda fb_ld+1
        cmp pu_st+1
        bne fb_ld
        lda fb_ld+2
        cmp pu_st+2
        beq fb_e
fb_ld:  lda BUF
        jsr CHROUT
        inc fb_ld+1
        bne fb_l
        inc fb_ld+2
        jmp fb_l
fb_e:   lda #0
        sta dflag
        sta nlin
        sta pu_st+1
        lda #$C3
        sta pu_st+2
fb_r:   rts

; fa scorrere in su di kk righe (1-25) schermo e colori in un solo passaggio, pulisce le righe liberate
; e rimette in ordine la tabella delle righe del KERNAL
scrollk:
        lda itop
        jsr mul40
        lda skl
        sta d1+1
        sta d2+1
        lda skh
        clc
        adc #$C8
        sta d1+2
        adc #$10
        sta d2+2
        lda kk
        clc
        adc itop
        jsr mul40
        lda skl
        sta s1+1
        sta s2+1
        lda skh
        clc
        adc #$C8
        sta s1+2
        adc #$10
        sta s2+2
        lda #25
        sec
        sbc kk
        sec
        sbc itop
        sta skn
        beq sk_c
sk1:    ldx #39
s1:     lda $C800,x
d1:     sta $C800,x
s2:     lda $D800,x
d2:     sta $D800,x
        dex
        bpl s1
        ldx #3
sk_a:   lda sktab,x
        sta skpp+1
        lda sktab+4,x
        sta skpp+2
        jsr add40
        dex
        bpl sk_a
        dec skn
        bne sk1
sk_c:   lda d1+1
        sta c1+1
        lda d1+2
        sta c1+2
        lda d2+1
        sta c2+1
        lda d2+2
        sta c2+2
        ldy kk
sk3:    ldx #39
sk4:    lda #32
c1:     sta $C800,x
        lda $0286
c2:     sta $D800,x
        dex
        bpl sk4
        lda #<c1
        sta skpp+1
        lda #>c1
        sta skpp+2
        jsr add40
        lda #<c2
        sta skpp+1
        lda #>c2
        sta skpp+2
        jsr add40
        dey
        bne sk3
        lda #0
        sta skl
        lda #$C8
        sta skh
        ldx #0
sk5:    lda skh
        ora #$80
        sta $D9,x
        lda skl
        clc
        adc #40
        sta skl
        bcc sk6
        inc skh
sk6:    inx
        cpx #25
        bne sk5
        rts
; skl/skh = A * 40
mul40:  tax
        lda #0
        sta skl
        sta skh
        cpx #0
        beq m4r
m4l:    lda skl
        clc
        adc #40
        sta skl
        bcc m4b
        inc skh
m4b:    dex
        bne m4l
m4r:    rts

; ---- immagine della stanza ----
; HDR+32: tabella, 2 byte per stanza (0 = nessuna). Record: [colonne][righe][1 = multicolore][colore di fondo]
; [bitmap: 8 byte per blocco, riga per riga][colori dello schermo: 1 byte per blocco][RAM colore: solo multicolore]
; Se l'immagine cambia: pulisce lo schermo (dopo un tasto, se c'e' testo nuovo da leggere), la disegna in alto,
; lascia una riga nera e il testo scorre sotto. Senza immagine (o al buio) il testo torna a tutto schermo.
pic:    lda #0
        sta IP
        sta IP+1
        jsr isdark
        bcs pi_set
        lda HDR+32
        ldx HDR+33
        ldy room
        jsr pi_get
pi_set: lda IP
        cmp curl
        bne pi_cj
        lda IP+1
        cmp curl+1
        bne pi_cj
        rts
pi_cj:  jmp pi_ch
pi_t:   lda $FFFF,y
        rts
; IP = elemento Y della tabella di puntatori A/X (se la tabella c'e')
pi_get: sta pi_t+1
        stx pi_t+2
        txa
        ora pi_t+1
        beq pg_r
        tya
        asl
        tay
        jsr pi_t
        sta IP
        iny
        jsr pi_t
        sta IP+1
pg_r:   rts
; immagine dell'oggetto del comando (HDR+34: tabella per oggetto), se il verbo e' tra quelli dell'elenco HDR+36 ([n][id dei verbi]).
; Un oggetto senza immagine lascia lo schermo com'e'.
picobj: lda fobj
        cmp #$FF
        beq po_r
        lda HDR+36
        sta po_v+1
        lda HDR+37
        sta po_v+2
        ora HDR+36
        beq po_r
        ldy #0
        jsr po_v
        tax
        beq po_r
po_l:   iny
        jsr po_v
        cmp verb
        beq po_ok
        dex
        bne po_l
po_r:   rts
po_v:   lda $FFFF,y
        rts
po_ok:  lda #0
        sta IP
        sta IP+1
        lda HDR+34
        ldx HDR+35
        ldy fobj
        jsr pi_get
        lda IP
        ora IP+1
        beq po_r
        jsr pi_set
; dopo il disegno il cursore e' sulla riga nera: la risposta (che non comincia andando a capo) parte dalla riga sotto
        ldx $D6
        inx
        cpx itop
        bne po_r
        ldy #0
        clc
        jmp PLOT
pi_ch:  lda IP
        sta curl
        lda IP+1
        sta curl+1
        ora IP
        bne pi_drw
        sta itop
        lda #NRIGHE
        sta nrig
        jmp irqoff
pi_drw: jsr flushw
        jsr flushb
        lda tout
        beq pi_c
        jsr more
pi_c:   jsr irqoff
        lda #147
        jsr CHROUT
        ldy #0
        lda (IP),y
        sta pcol
        iny
        lda (IP),y
        sta prow
        clc
        adc #1
        sta itop
        lda #NRIGHE
        sec
        sbc itop
        sta nrig
        lda itop
        asl
        asl
        asl
        adc #$2F
        sta isplit
        iny
        lda (IP),y
        beq pi_h
        lda #$18
        ldx #$FF
        bne pi_m
pi_h:   lda #$08
        ldx #0
pi_m:   sta imode
        stx ifill
        iny
        lda (IP),y
        sta ibg
        lda #4
        jsr ipadd
        lda #40
        sec
        sbc pcol
        lsr
        sta px0
; pulisce bitmap (righe 0-17), colori e RAM colore delle prime righe: tutto nero
        lda #$E0
        ldx #23
        ldy ifill
        jsr fill
        lda #$CC
        ldx #3
        ldy #0
        jsr fill
        lda #$D8
        ldx #3
        ldy #0
        jsr fill
; riga nera di separazione: spazi nella matrice dei colori (nel modo testo, a meta' riga, si vedono spazi)
        lda prow
        jsr mul40
        lda skl
        sta DST
        lda skh
        clc
        adc #$CC
        sta DST+1
        lda #32
        ldy #39
pi_sp:  sta (DST),y
        dey
        bpl pi_sp
; bitmap: per riga 2 x (colonne x 4) byte, passo 320
        lda pcol
        asl
        asl
        sta cpn
        lda px0
        asl
        asl
        asl
        sta DST
        lda #$E0
        sta DST+1
        lda #2
        sta pmul
        lda #<320
        sta stl
        lda #>320
        sta sth
        jsr pass
; colori dello schermo, passo 40
        lda pcol
        sta cpn
        lda #1
        sta pmul
        lda #40
        sta stl
        lda #0
        sta sth
        lda px0
        sta DST
        lda #$CC
        sta DST+1
        jsr pass
        lda imode
        cmp #$18
        bne pi_e
        lda px0
        sta DST
        lda #$D8
        sta DST+1
        jsr pass
pi_e:   jsr irqon
        ldx itop
        dex
        ldy #0
        clc
        jsr PLOT
        lda #0
        sta col
        sta nlin
        sta tout
        rts
; Y nelle X pagine da A00 in poi
fill:   sta DST+1
        lda #0
        sta DST
        tya
        ldy #0
fl1:    sta (DST),y
        iny
        bne fl1
        inc DST+1
        dex
        bne fl1
        rts
; IP += A
ipadd:  clc
        adc IP
        sta IP
        bcc ia_r
        inc IP+1
ia_r:   rts
; prow righe: per ognuna pmul copie di cpn byte da IP (che avanza) a DST; poi DST = inizio riga + passo
pass:   lda prow
        sta pcnt
pa1:    lda DST
        sta rsl
        lda DST+1
        sta rsh
        ldx pmul
pa2:    ldy #0
pa3:    lda (IP),y
        sta (DST),y
        iny
        cpy cpn
        bne pa3
        tya
        jsr ipadd
        tya
        clc
        adc DST
        sta DST
        bcc pa4
        inc DST+1
pa4:    dex
        bne pa2
        lda rsl
        clc
        adc stl
        sta DST
        lda rsh
        adc sth
        sta DST+1
        dec pcnt
        bne pa1
        rts
; interrupt di raster (il timer del CIA e' spento: tastiera e orologio del KERNAL girano una volta per quadro, dopo il cambio a testo)
; in cima bitmap (modo e fondo dell'immagine), a meta' della riga nera torna il testo
irqon:  sei
        lda #$7F
        sta $DC0D
        lda $DC0D
        lda #<irq
        sta $0314
        lda #>irq
        sta $0315
        lda #0
        sta irqst
        lda #$10
        sta $D012
        lda #$1B
        sta $D011
        lda #1
        sta $D01A
        sta $D019
        cli
        rts
irqoff: sei
        lda #0
        sta $D01A
        lda #$81
        sta $DC0D
        lda #$31
        sta $0314
        lda #$EA
        sta $0315
        lda #1
        sta $D019
        jsr ir_tm
        cli
        rts
irq:    lda $D019
        and #1
        beq ir_k
        sta $D019
        lda irqst
        bne ir_t
        lda #$3B
        sta $D011
        lda imode
        sta $D016
        lda #$38
        sta $D018
        lda ibg
        sta $D021
        lda isplit
        sta $D012
        inc irqst
        jmp $EA81
ir_t:   jsr ir_tm
        lda #0
        sta irqst
        lda #$10
        sta $D012
        jmp $EA31
ir_k:   jmp $EA31
; modo testo: schermo a $C800, font a $D000, fondo nero
ir_tm:  lda #$1B
        sta $D011
        lda #$08
        sta $D016
        lda #$24
        sta $D018
        lda #0
        sta $D021
        rts

; somma 40 all'indirizzo (2 byte) dentro l'istruzione che sta all'indirizzo skpp+1/skpp+2 (+1)
add40:  stx tmpd
        ldx #1
skpp:   lda $FFFF,x
        clc
        adc #40
        jsr skw
        bcc ad_r
        inx
        jsr skr
        adc #0
        jsr skw
ad_r:   ldx tmpd
        rts
skr:    lda skpp+1
        sta skr2+1
        lda skpp+2
        sta skr2+2
skr2:   lda $FFFF,x
        rts
skw:    pha
        lda skpp+1
        sta skw2+1
        lda skpp+2
        sta skw2+2
        pla
skw2:   sta $FFFF,x
        rts
sktab:  .byte <s1, <d1, <s2, <d2, >s1, >d1, >s2, >d2

; scrive «premi un tasto», aspetta un tasto e cancella la riga (kwait = 1 mentre aspetta: serve ai test)
more:   lda #1
        sta dflag
        lda #T_TASTO
        jsr prdir
        lda #1
        sta kwait
mo1:    jsr GETIN
        beq mo1
        lda #0
        sta kwait
        sta tout
        sec
        jsr PLOT
        stx frow
        ldy #0
        clc
        jsr PLOT
        ldy #39
mo2:    lda #32
        jsr CHROUT
        dey
        bne mo2
        ldx frow
        ldy #0
        clc
        jsr PLOT
        lda #0
        sta dflag
        lda #1
        sta nlin
        rts

; stampa direttamente il messaggio A (senza passare per outc), conservando P1, P2 e xk
prdir:  asl
        sta tmpd
        lda P1
        pha
        lda P1+1
        pha
        lda P2
        pha
        lda P2+1
        pha
        lda xk
        pha
        lda HDR+8
        sta P2
        lda HDR+9
        sta P2+1
        ldy tmpd
        lda (P2),y
        sta P1
        iny
        lda (P2),y
        sta P1+1
        ldy #0
        lda #TKEY
        sta xk
pd1:    lda (P1),y
        eor xk
        beq pd_e
        cmp #8
        bcs pd2
        tax
        lda coltab,x
pd2:    jsr CHROUT
        lda xk
        clc
        adc #TSTEP
        sta xk
        iny
        bne pd1
pd_e:   pla
        sta xk
        pla
        sta P2+1
        pla
        sta P2
        pla
        sta P1+1
        pla
        sta P1
        rts

; legge una riga da tastiera in LINE (massimo 38 caratteri, terminata da 0)
readline:
        lda #0
        sta llen
rl1:    jsr curdraw
        jsr GETIN
        beq rl1
        pha
        jsr curoff
        pla
        cmp #13
        beq rldone
        cmp #20
        bne rl2
        lda llen
        beq rl1
        dec llen
        lda #20
        jsr CHROUT
        jmp rl1
rl2:    cmp #193
        bcc rl3
        cmp #219
        bcs rl1
        sec
        sbc #128
rl3:    cmp #32
        bcc rl1
        cmp #96
        bcs rl1
        ldx llen
        cpx #37
        bcs rl1
        sta LINE,x
        inc llen
        jsr CHROUT
        jmp rl1
rldone: ldx llen
        lda #0
        sta LINE,x
        lda #13
        jsr putc
        rts

; cursore del gioco (il lampeggio del KERNAL e' spento: con GETIN lasciava blocchi colorati a fine riga).
; Blocco pieno che lampeggia col clock di sistema (circa un lampo al secondo), nella cella dove andra' il prossimo carattere.
curdraw:
        jsr cursync
        lda $A2
        and #$20
        beq cd_sp
        lda #$A0
        bne cd_st
cd_sp:  lda #$20
cd_st:  sta ($D1),y
        lda $0286
        sta ($F3),y
        rts
curoff: jsr cursync
        lda #$20
        sta ($D1),y
        rts
; puntatore al colore della riga attuale (come la routine $EA24 del KERNAL; schermo a $C800 -> colori a $D800)
cursync:
        lda $D1
        sta $F3
        lda $D2
        and #$03
        ora #$D8
        sta $F4
        ldy $D3
        rts

; cerca WORD (lunghezza wlen) nel vocabolario: restituisce wtype (0 = sconosciuta) e wid
lookup: lda #0
        sta wtype
        lda HDR+6
        sta P1
        lda HDR+7
        sta P1+1
lk_next:
        ldy #0
        lda (P1),y
        beq lk_end
        cmp wlen
        bne lk_skip
        sta tmp
        ldy #1
lk_cmp: lda (P1),y
        eor #VKEY
        cmp WORD-1,y
        bne lk_skip
        cpy tmp
        beq lk_found
        iny
        jmp lk_cmp
lk_found:
        iny
        lda (P1),y
        sta wtype
        iny
        lda (P1),y
        sta wid
lk_end: rts
lk_skip:
        ldy #0
        lda (P1),y
        clc
        adc #3
        adc P1
        sta P1
        bcc lk_next
        inc P1+1
        jmp lk_next

; stampa la parola in WORD
prword: ldy #0
pw1:    lda WORD,y
        beq pwend
        jsr outc
        iny
        bne pw1
pwend:  rts

; interpreta la riga in LINE
execute:
        lda #0
        sta verb
        sta lpos
        sta nwords
        lda #$FF
        sta dirv
        ldx #7
ex_i:   sta slots,x
        dex
        bpl ex_i
        lda #0
        sta cs
ex_sk:  ldx lpos
        lda LINE,x
        bne ex_s1
        jmp ex_end
ex_s1:  cmp #32
        bne ex_word
        inc lpos
        jmp ex_sk
ex_word:
        ldy #0
ex_cp:  ldx lpos
        lda LINE,x
        beq ex_cpe
        cmp #32
        beq ex_cpe
        cpy #16
        bcs ex_nx
        sta WORD,y
        iny
ex_nx:  inc lpos
        jmp ex_cp
ex_cpe: sty wlen
        lda #0
        sta WORD,y
        inc nwords
        jsr lookup
        lda wtype
        bne ex_known
        lda #T_PRE
        jsr prtext
        jsr prword
        lda #T_POST
        jmp prtext
ex_known:
        cmp #1
        bne ex_nv
        lda verb
        bne ex_sk
        lda wid
        sta verb
        jmp ex_sk
ex_nv:  cmp #2
        bne ex_n4
        lda dirv
        cmp #$FF
        bne ex_sk
        lda wid
        sta dirv
        jmp ex_sk
ex_n4:  cmp #3
        bne ex_n5
        lda wid
        beq ex_sk2
        lda slots
        and slots+2
        cmp #$FF
        beq ex_sk2      ; preposizione prima dell'oggetto ("turn on lamp"): non separa niente
        lda #4
        sta cs
        jmp ex_sk
ex_n5:  cmp #4
        bne ex_n6
        ldx cs
        lda slots,x
        cmp #$FF
        bne ex_n5b
        lda wid
        sta slots,x
        jmp ex_sk
ex_n5b: lda slots+1,x
        cmp #$FF
        bne ex_sk2
        lda wid
        sta slots+1,x
        jmp ex_sk
ex_n6:  cmp #5
        bne ex_sk2
        ldx cs
        lda slots+2,x
        cmp #$FF
        bne ex_n6b
        lda wid
        sta slots+2,x
        jmp ex_sk
ex_n6b: lda slots+3,x
        cmp #$FF
        bne ex_sk2
        lda wid
        sta slots+3,x
ex_sk2: jmp ex_sk
ex_end: lda nwords
        bne ex_e1
        rts
ex_e1:
        lda verb
        bne ex_have
        lda dirv
        cmp #$FF
        bne ex_dv
        jmp ex_nocap
ex_dv:  lda #2
        sta verb
ex_have:
        lda verb
        cmp #8
        bne ex_sv0
        jmp do_ripeti
ex_sv0: ldx #0
ex_sv1: lda LINE,x
        sta LAST,x
        beq ex_sv2
        inx
        cpx #47
        bcc ex_sv1
        lda #0
        sta LAST,x
ex_sv2: jsr mergeadj
        lda #7
        sta fscope
        ldx #0
        jsr findtol
        sta robj
        ldx #4
        jsr findtol
        sta robj2
        lda robj
        sta fobj
        ldx #0
        jsr sempty
        bne ex_fo
        lda robj2
        sta fobj
ex_fo:  jsr swapobj
        ldx #0
        jsr sempty
        bne ex_pb
        ldx #4
ex_pb:  stx pbase
        jsr picobj
        jsr runrules
        beq ex_run
        rts
ex_run: lda verb
        cmp #1
        bne ex_v2
        jmp do_guarda
ex_v2:  cmp #2
        bne ex_v3
        jmp do_vai
ex_v3:  cmp #3
        bne ex_v4
        jmp do_prendi
ex_v4:  cmp #4
        bne ex_v5
        jmp do_lascia
ex_v5:  cmp #5
        bne ex_v6
        jmp do_inv
ex_v6:  cmp #6
        bne ex_v7
        jmp do_metti
ex_v7:  cmp #7
        bne ex_v9
        lda #T_TEMPO
        jmp prtext
ex_v9:  cmp #9
        bne ex_oth
        lda #T_AIUTO
        jmp prtext
ex_oth: ldx pbase
        jsr sempty
        beq ex_nien
        lda #7
        sta fscope
        ldx pbase
        jsr findobj
        ldx famb
        bne ex_amb
        cmp #$FF
        bne ex_nien
        lda #T_NONPRE
        jmp prtext
ex_nien:
        lda #T_NIENTE
        jmp prtext
ex_amb: lda #T_QUALE
        jmp prtext
ex_nocap:
        lda #T_NONCAP
        jmp prtext
ex_ret: rts

; vai nella direzione dirv
do_vai: lda dirv
        cmp #$FF
        bne dv1
        lda #T_DOVE
        jmp prtext
dv1:    sta dsel
        jsr getexit
        lda xst
        bne dv2
        lda #T_NOEXIT
        jmp prtext
dv2:    cmp #1
        beq dv3
        lda xbp
        ora xbp+1
        bne dv4
        lda #T_BLOCK
        jmp prtext
dv4:    lda xbp
        sta P1
        lda xbp+1
        sta P1+1
        jmp prstr
dv3:    lda xtgt
        sta room
        jsr describe
        jmp events

; eventi d'ingresso: tutte le regole con comando $FE per la stanza attuale (o per ogni stanza)
events: lda #$FE
        sta verb
        lda room
        sta robj
        lda #$FF
        sta robj2
        lda #1
        sta rmode
        jsr runrules
        lda #0
        sta rmode
        rts

; guarda [oggetto]
do_guarda:
        ldx pbase
        jsr sempty
        bne dg0
        jmp describe
dg0:    lda #3
        sta fscope
        ldx pbase
        jsr findobj
        ldx famb
        beq amk1
        jmp amb_msg
amk1:
        cmp #$FF
        bne dg1
        lda #T_NONPRE
        jmp prtext
dg1:    sta idx
        lda #4
        jsr getptr
        jsr prstr
        lda idx
        jmp showcont
amb_msg:
        lda #T_QUALE
        jmp prtext

; ripeti: rifa' l'ultimo comando (LAST non contiene mai «ripeti»)
do_ripeti:
        lda LAST
        bne rp_ok
        lda #T_NIENTE
        jmp prtext
rp_ok:  ldx #0
rp_c:   lda LAST,x
        sta LINE,x
        beq rp_go
        inx
        bne rp_c
rp_go:  jmp execute

; l'oggetto trovato nello slot pbase e' «tutto»? (flag 128) A = oggetto, famb = ambiguita'
istutto:
        lda #7
        sta fscope
        ldx pbase
        jsr findobj
        ldx famb
        bne it_no
        cmp #$FF
        beq it_no
        tax
        lda oflags,x
        bmi it_yes
it_no:  clc
        rts
it_yes: sec
        rts

; carry acceso se la stanza e' buia e nessuna fonte di luce accesa e' qui o con te (HDR+30 = tabella per stanza, 0 = nessuna stanza buia)
isdark: lda HDR+30
        ora HDR+31
        beq id_no
        lda HDR+30
        sta P3
        lda HDR+31
        sta P3+1
        ldy room
        lda (P3),y
        beq id_no
        ldx #0
id_l:   cpx HDR+10
        bcs id_yes
        lda oflags,x
        and #2
        beq id_n
        lda ostate,x
        and #2
        beq id_n
        stx dtmp
        jsr effloc
        cmp room
        beq id_no
        cmp #$FE
        beq id_no
        ldx dtmp
id_n:   inx
        jmp id_l
id_yes: sec
        rts
id_no:  clc
        rts

; prendi tutto: ogni oggetto prendibile che sta in stanza, uno per riga («etichetta: Preso.»)
takeall:
        jsr isdark
        bcc ta_ok0
        lda #T_NIENTEPR
        jmp prtext
ta_ok0: lda #0
        sta tai
        sta tcnt
ta_l:   lda tai
        cmp HDR+10
        bcs ta_end
        sta idx
        lda #0
        sta lschar
        lda room
        sta lsloc
        jsr fits
        bcc ta_n
        ldx tai
        lda oflags,x
        and #1
        beq ta_n
        inc tcnt
        jsr ta_label
        lda tai
        sta robj
        lda #$FF
        sta robj2
        lda #3
        sta verb
        jsr runrules
        bne ta_r
        ldx tai
        lda #$FE
        sta objloc,x
        lda #T_PRESO
        jsr prtext
ta_r:   lda fin
        bne ta_x
ta_n:   inc tai
        jmp ta_l
ta_end: lda tcnt
        bne ta_x
        lda #T_NIENTEPR
        jmp prtext
ta_x:   rts

; stampa «etichetta: » dell'oggetto idx
ta_label:
        lda #T_COLTXT
        jsr prtext
        lda #2
        jsr getptr
        jsr prstr
        lda #T_DUEP
        jmp prtext

; lascia tutto: ogni oggetto che hai con te
leaveall:
        lda #0
        sta tai
        sta tcnt
la_l:   lda tai
        cmp HDR+10
        bcs la_end
        sta idx
        lda #0
        sta lschar
        lda #$FE
        sta lsloc
        jsr fits
        bcc la_n
        inc tcnt
        jsr ta_label
        lda tai
        sta robj
        lda #$FF
        sta robj2
        lda #4
        sta verb
        jsr runrules
        bne la_r
        ldx tai
        lda room
        sta objloc,x
        lda #T_LASCIA
        jsr prtext
la_r:   lda fin
        bne la_x
la_n:   inc tai
        jmp la_l
la_end: lda tcnt
        bne la_x
        lda #T_NIENTELA
        jmp prtext
la_x:   rts

; prendi oggetto
do_prendi:
        ldx pbase
        jsr sempty
        bne dp0
        lda #T_COSAPR
        jmp prtext
dp0:    jsr istutto
        bcc dp0n
        jmp takeall
dp0n:   lda #1
        sta fscope
        ldx pbase
        jsr findobj
        ldx famb
        beq amk2
        jmp amb_msg
amk2:
        cmp #$FF
        bne dp3
        lda #2
        sta fscope
        ldx pbase
        jsr findobj
        ldx famb
        beq amk3
        jmp amb_msg
amk3:
        cmp #$FF
        beq dp2
        tax
        ldy objloc,x
        cpy #$FE
        bne dp3
        lda #T_GIA
        jmp prtext
dp2:    lda #T_NONPRE
        jmp prtext
dp3:    sta obj
        sta idx
        jsr objptr
        ldy #1
        lda (P3),y
        and #32
        beq dp3b
        lda #T_NOPERS
        jmp prtext
dp3b:   lda (P3),y
        and #1
        bne dp4
        lda #T_NONPRN
        jmp prtext
dp4:    ldx obj
        lda #$FE
        sta objloc,x
        lda #T_PRESO
        jmp prtext

; lascia oggetto
do_lascia:
        ldx pbase
        jsr sempty
        bne dl0
        lda #T_COSALA
        jmp prtext
dl0:    jsr istutto
        bcc dl0n
        jmp leaveall
dl0n:   lda #2
        sta fscope
        ldx pbase
        jsr findobj
        ldx famb
        beq amk4
        jmp amb_msg
amk4:
        cmp #$FF
        bne dl2
        lda #T_NONHAI
        jmp prtext
dl2:    tax
        lda room
        sta objloc,x
        lda #T_LASCIA
        jmp prtext

; metti oggetto (con te) in contenitore (presente e aperto, non dentro l'oggetto)
do_metti:
        ldx #0
        jsr sempty
        beq dm_cosa
        ldx #4
        jsr sempty
        beq dm_cosa
        lda #2
        sta fscope
        ldx #0
        jsr findobj
        ldx famb
        bne dm_amb
        cmp #$FF
        bne dm2
        lda #T_NONHAI
        jmp prtext
dm_cosa:
        lda #T_METTI
        jmp prtext
dm_amb: jmp amb_msg
dm2:    sta obj
        lda #3
        sta fscope
        ldx #4
        jsr findobj
        ldx famb
        bne dm_amb
        cmp #$FF
        bne dm5
        lda #T_NONPRE
        jmp prtext
dm5:    sta obj2
        tax
        lda oflags,x
        and #8
        beq dm_no
        lda obj2
dm7:    cmp obj
        beq dm_no
        tax
        lda objloc,x
        cmp #$80
        bcc dm8
        cmp #$FE
        bcs dm8
        and #$7F
        jmp dm7
dm8:    ldx obj2
        lda oflags,x
        and #$10
        beq dm9
        lda ostate,x
        and #1
        bne dm9
        lda #T_CHIUSO
        jmp prtext
dm9:    ldx obj
        lda obj2
        ora #$80
        sta objloc,x
        lda #T_MESSO
        jmp prtext
dm_no:  lda #T_NONCON
        jmp prtext

; inventario
do_inv: lda #$FE
        sta lsloc
        lda #T_INV
        sta lspre
        jsr listobj
        bne di_ret
        lda #T_INVVUO
        jmp prtext
di_ret: rts

; slot vuoto? X = 0 o 4: Z = 1 se non ci sono ne' nomi ne' aggettivi
sempty: lda slots,x
        and slots+2,x
        cmp #$FF
        rts

; dopo una preposizione solo aggettivi ("chiave di ferro"): passano nel primo oggetto
mergeadj:
        lda slots+4
        cmp #$FF
        bne mg_r
        ldy #6
mg_l:   lda slots,y
        cmp #$FF
        beq mg_n
        tax
        lda slots+2
        cmp #$FF
        bne mg_3
        stx slots+2
        jmp mg_c
mg_3:   lda slots+3
        cmp #$FF
        bne mg_c
        stx slots+3
mg_c:   lda #$FF
        sta slots,y
mg_n:   iny
        cpy #8
        bcc mg_l
mg_r:   rts

; se il primo oggetto e' un personaggio e il secondo un argomento li scambia (prima l'argomento)
swapobj:
        lda robj
        cmp #$FF
        beq sw_r
        lda robj2
        cmp #$FF
        beq sw_r
        ldx robj
        lda oflags,x
        and #32
        beq sw_r
        ldx robj2
        lda oflags,x
        and #64
        beq sw_r
        lda robj
        ldx robj2
        sta robj2
        stx robj
sw_r:   rts

; come findobj, ma l'ambiguita' vale "nessun oggetto" (per le regole)
findtol:
        jsr findobj
        ldx famb
        beq ft_ok
        lda #$FF
ft_ok:  rts

; cerca fra gli oggetti presenti (fscope: 1 = in stanza, 2 = con te, 3 = tutti e due) quelli che corrispondono alle
; parole dello slot X (0 o 4): almeno un nome fra quelli dati e tutti gli aggettivi.
; Esce con A = primo oggetto trovato o $FF; famb = 1 se piu' oggetti rispondono allo stesso nome (o solo agli aggettivi)
findobj:
        stx fx
        lda #0
        sta famb
        sta fc0
        sta fc1
        sta ftot
        lda #$FF
        sta ffirst
        jsr sempty
        bne fo_go
        rts
fo_go:  jsr isdark
        lda #0
        rol
        sta fdark
        lda HDR+28
        sta P2
        lda HDR+29
        sta P2+1
        lda #0
        sta fi
fo_loop:
        lda fi
        cmp HDR+10
        bcc fo_obj
        jmp fo_end
fo_obj: lda #0
        sta fm0
        sta fm1
        sta fa0
        sta fa1
        ldx fx
        ldy #0
        lda (P2),y
        sta fnn
        iny
fo_n:   lda fnn
        beq fo_nd
        lda (P2),y
        iny
        sta fw
        cmp slots,x
        bne fo_n1
        lda #1
        sta fm0
fo_n1:  lda fw
        cmp slots+1,x
        bne fo_n2
        lda #1
        sta fm1
fo_n2:  dec fnn
        jmp fo_n
fo_nd:  lda (P2),y
        sta fnn
        iny
fo_a:   lda fnn
        beq fo_ad
        lda (P2),y
        iny
        sta fw
        cmp slots+2,x
        bne fo_a1
        lda #1
        sta fa0
fo_a1:  lda fw
        cmp slots+3,x
        bne fo_a2
        lda #1
        sta fa1
fo_a2:  dec fnn
        jmp fo_a
fo_ad:  tya
        clc
        adc P2
        sta P2
        bcc fo_c1
        inc P2+1
fo_c1:  ; aggettivi richiesti presenti?
        lda slots+2,x
        cmp #$FF
        beq fo_c2
        lda fa0
        beq fo_next
fo_c2:  lda slots+3,x
        cmp #$FF
        beq fo_c3
        lda fa1
        beq fo_next
fo_c3:  ; se e' stato dato un nome, deve corrispondere
        lda slots,x
        and slots+1,x
        cmp #$FF
        beq fo_c4
        lda fm0
        ora fm1
        beq fo_next
fo_c4:  ; argomento di conversazione (flag 64): vale solo per le regole (fscope bit 2)
        ldx fi
        lda oflags,x
        and #$40
        beq fo_c4n
        lda fscope
        and #4
        beq fo_nx2
        jmp fo_cand
fo_nx2: jmp fo_next
fo_c4n: ; presenza (posizione effettiva)
        ldx fi
        jsr effloc
        cmp room
        bne fo_c5
        lda fscope
        and #1
        beq fo_next
        lda fdark
        bne fo_next
        jmp fo_cand
fo_c5:  cmp #$FE
        bne fo_next
        lda fscope
        and #2
        beq fo_next
fo_cand:
        lda ffirst
        cmp #$FF
        bne fo_k
        lda fi
        sta ffirst
fo_k:   inc ftot
        lda fm0
        beq fo_k1
        inc fc0
fo_k1:  lda fm1
        beq fo_next
        inc fc1
fo_next:
        inc fi
        jmp fo_loop
fo_end: ldx fx
        lda slots,x
        and slots+1,x
        cmp #$FF
        beq fo_nn
        lda fc0
        cmp #2
        bcs fo_amb
        lda fc1
        cmp #2
        bcs fo_amb
        jmp fo_ret
fo_nn:  lda ftot
        cmp #2
        bcc fo_ret
fo_amb: lda #1
        sta famb
fo_ret: lda ffirst
        rts

; prova le regole in ordine; A = 1 se una ha agito, 0 altrimenti
; regola: [lunghezza][comando][oggetto o $FF][con o $FF][n condizioni][condizioni][testo altrimenti (2 byte)][azioni...][0]
runrules:
        lda HDR+14
        sta RP
        lda HDR+15
        sta RP+1
rr_next:
        ldy #0
        lda (RP),y
        bne rr_a
        lda #0
        rts
rr_a:   iny
        lda (RP),y
        cmp verb
        bne rr_skip
        iny
        lda (RP),y
        cmp #$FF
        beq rr_o2
        cmp robj
        bne rr_skip
rr_o2:  iny
        lda (RP),y
        cmp #$FF
        beq rr_c
        cmp robj2
        bne rr_skip
rr_c:   lda #$FF
        sta copen
        lda #4
        sta ry
        jsr evalconds
        pha
        jsr nextb
        sta P1
        jsr nextb
        sta P1+1
        pla
        bne rr_act
        lda P1
        ora P1+1
        beq rr_skip
        jsr prstr
        lda #1
        rts
rr_skip:
        ldy #0
        lda (RP),y
        sec
        adc RP
        sta RP
        bcc rr_next
        inc RP+1
        jmp rr_next
rr_act: jsr nextb
        bne ra_1
        jmp ra_done
ra_1:   cmp #1
        bne ra_2
        jsr nextb
        sta P1
        jsr nextb
        sta P1+1
        jsr prstr
        jmp rr_act
ra_2:   cmp #2
        bne ra_3
        jsr nextb
        tax
        jsr nextb
        sta objloc,x
        jmp rr_act
ra_3:   cmp #3
        bne ra_4
        jsr nextb
        tax
        stx copen
        lda ostate,x
        ora #1
        sta ostate,x
        jmp rr_act
ra_4:   cmp #4
        bne ra_5
        jsr nextb
        tax
        lda ostate,x
        and #$FE
        sta ostate,x
        jmp rr_act
ra_5:   cmp #5
        bne ra_6
        jsr nextb
        tax
        lda ostate,x
        ora #2
        sta ostate,x
        jmp rr_act
ra_6:   cmp #6
        bne ra_7
        jsr nextb
        tax
        lda ostate,x
        and #$FD
        sta ostate,x
        jmp rr_act
ra_7:   cmp #7
        bne ra_8
        lda RP
        pha
        lda RP+1
        pha
        lda ry
        pha
        jsr describe
        pla
        sta ry
        pla
        sta RP+1
        pla
        sta RP
        jmp rr_act
ra_8:   cmp #8
        bne ra_9
        jsr nextb
        sta P1
        jsr nextb
        sta P1+1
        jsr prstr
        lda #T_FINE
        jsr prtext
        lda #1
        sta fin
        jmp rr_act
ra_9:   cmp #9
        bne ra_10
        jsr nextb
        tax
        jsr nextb
        sta vars,x
        jmp rr_act
ra_10:  cmp #10
        bne ra_11
        jsr nextb
        tax
        jsr nextb
        sta vtmp
        jsr nextb
        sta vtmp2
        lda vars,x
        clc
        adc vtmp
        bcs ra10m
        cmp vtmp2
        bcc ra10s
ra10m:  lda vtmp2
ra10s:  sta vars,x
        jmp rr_act
ra_11:  jsr nextb
        tax
        jsr nextb
        sta vtmp
        lda vars,x
        sec
        sbc vtmp
        bcs ra11s
        lda #0
ra11s:  sta vars,x
        jmp rr_act
ra_done:
        lda copen
        cmp #$FF
        beq rd_c
        jsr showcont
rd_c:   lda rmode
        beq rd_n
        lda fin
        bne rd_n
        jmp rr_skip
rd_n:   lda #1
        rts
