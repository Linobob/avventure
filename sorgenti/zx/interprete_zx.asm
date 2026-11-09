; Interprete per ZX Spectrum 48K, passo 3: completo (come la versione C64): regole, stati degli oggetti, uscite con condizioni, frammenti di descrizione.
; Licenza MIT. Il codice sta a $8000; i dati del gioco (stessa struttura della versione C64) sono aggiunti dal compilatore a partire da HDR.
; Intestazione dei dati (a HDR), parole a 16 bit in ordine little endian:
;   +0 stanza iniziale   +1 numero di stanze   +2 tabella testi stanze (2 byte per stanza)
;   +4 tabella uscite (8 byte per stanza, 0 = nessuna, 1..127 = stanza+1)   +6 vocabolario   +8 tabella messaggi
;   +10 numero di oggetti   +12 tabella oggetti (16 byte l'uno, vedi la versione C64)
; (intestazione di 30 byte: +28 parole degli oggetti)
;   +24 tabella dei valori iniziali delle variabili, +26 numero di variabili (formato 2 esteso)
;   +14 regole   +16 tabella uscite con condizioni   +18 nomi delle direzioni   +20 numero di direzioni   +22 frammenti (vedi la versione C64)
; Vocabolario: [lunghezza][lettere minuscole][tipo][id] ... 0   (tipo 1 = comando, 2 = direzione, 3 = parola ignorata (id 1 = preposizione), 4 = nome di oggetto, 5 = aggettivo)

HDR    = $9400
; uscita a blocchi e pausa a schermo pieno
pch    = $F420
nlin   = $F421
dflag  = $F422
kwait  = $F423
frow   = $F424
kkz    = $F425
bptr   = $F426
BUF    = $F500
; immagini: itop = prima riga del testo (sotto l'immagine), nrig = righe prima della pausa, curimg = immagine mostrata, tout = testo scritto dopo il comando
itop   = $F428
nrig   = $F429
curimg = $F42A
tout   = $F42C
prow   = $F42D
px0    = $F42E
pcol   = $F42F
T_TASTO = 47
NRIGHE = 21
SPOSN  = 23688
ATTRP  = 23693
room   = $F000
verb   = $F001
dirv   = $F002
wlen   = $F003
wtype  = $F004
wid    = $F005
lpos   = $F007
nwords = $F008
llen   = $F009
seen   = $F00F
dsel   = $F019
col    = $F030
wlen2  = $F031
fwi    = $F032
wvis   = $F033
fcol   = $F03E
; i testi nei dati sono rimescolati: byte XOR una chiave che parte da TKEY e cresce di TSTEP a ogni carattere
TKEY   = $A7
TSTEP  = $3B
; le lettere del vocabolario sono XOR VKEY
VKEY   = $55
kcs    = $F034
kk     = $F037
nmask  = $F038
lastrow  = $F039
lastmask = $F03A
lastseen = $F03B
CUR    = $F060
HELD   = $F068
FRAMES = 23672
LINE   = $F100
WORD   = $F120
WBUF   = $F140
SCRCT  = 23692
tmp    = $F006
obj    = $F00A
cnt    = $F00B
idx    = $F00C
lsloc  = $F00D
lspre  = $F00E
obj2   = $F012
rec    = $F013
robj   = $F040
robj2  = $F041
fin    = $F042
rn     = $F043
rok    = $F044
ry     = $F045
xst    = $F046
xtgt   = $F047
xnas   = $F048
xbp    = $F049
xrp    = $F04B
fc     = $F04D
rp     = $F04E
lchr   = $F03C
repnext = $F03D
objloc = $F200
ostate = $F280
vars   = $F300
rmode  = $F050
lschar = $F052
lsmul  = $F053
lsfl   = $F054
tai    = $F055
tcnt   = $F056
dtmp   = $F057
fdark  = $F35B
LAST   = $F400
slots  = $F340
cs     = $F348
fscope = $F349
famb   = $F34A
ffirst = $F34B
fc0    = $F34C
fc1    = $F34D
ftot   = $F34E
fi     = $F34F
fm0    = $F350
fm1    = $F351
fx     = $F352
fa0    = $F353
fa1    = $F354
pbase  = $F355
fsp    = $F356
fnext  = $F358
copen  = $F35A
oflags = $F380

T_NONCAP = 0
T_PRE    = 1
T_POST   = 2
T_DOVE   = 3
T_NOEXIT = 4
T_PROMPT = 5
T_INTRO  = 7
T_NIENTE = 6
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

        .org $8000
start:  ld hl,udg
        ld (23675),hl
        ld a,7
        ld (23693),a
        ld (23624),a
        xor a
        out ($FE),a
        call $0D6B
        ld a,2
        call $1601
        xor a
        ld (col),a
        ld (wlen2),a
        ld (wvis),a
        ld a,(HDR)
        ld (room),a
        xor a
        ld (fin),a
        ld (rmode),a
        ld (lschar),a
        ld (lsmul),a
        ld (LAST),a
        ld (idx),a
        ld (nlin),a
        ld (dflag),a
        ld (kwait),a
        ld hl,BUF
        ld (bptr),hl
        ld (itop),a
        ld (tout),a
        ld h,a
        ld l,a
        ld (curimg),hl
        ld a,NRIGHE
        ld (nrig),a
in1:    ld a,(HDR+10)
        ld b,a
        ld a,(idx)
        cp b
        jr nc,in2
        call objptr
        ld c,(hl)
        inc hl
        ld b,(hl)
        ld a,(idx)
        ld e,a
        ld d,0
        ld hl,objloc
        add hl,de
        ld (hl),c
        ld hl,oflags
        add hl,de
        ld (hl),b
        ld hl,idx
        inc (hl)
        jr in1
in2:    ld hl,ostate
        ld de,ostate+1
        ld bc,127
        ld (hl),0
        ldir
        ld hl,vars
        ld de,vars+1
        ld bc,63
        ld (hl),0
        ldir
        ld a,(HDR+26)
        or a
        jr z,iv_end
        ld c,a
        ld b,0
        ld hl,(HDR+24)
        ld de,vars
        ldir
iv_end: ld a,T_INTRO
        call prtext
        call flushw
        call flushb
        ld a,(HDR+11)
        and 2
        call nz,more
        call describe
        call events
main:   ld a,T_PROMPT
        call prtext
        call flushw
        call flushb
        xor a
        ld (nlin),a
        call readline
        xor a
        ld (col),a
        ld (tout),a
        ld a,255
        ld (SCRCT),a
        ld a,(fin)
        or a
        jp nz,start
        call execute
        jr main

; scrive la parola in attesa (WBUF), andando a capo se non ci sta
flushw: ld a,(wlen2)
        or a
        ret z
        ld a,(wvis)
        ld hl,col
        add a,(hl)
        cp 32
        jr c,fw_p
        ld a,13
        call putc
        xor a
        ld (col),a
fw_p:   xor a
        ld (fwi),a
fw_l:   ld a,(fwi)
        ld e,a
        ld d,0
        ld hl,WBUF
        add hl,de
        ld a,(hl)
        call putc
fw_n:   ld a,(fwi)
        inc a
        ld (fwi),a
        ld hl,wlen2
        cp (hl)
        jr nz,fw_l
        ld a,(wvis)
        ld hl,col
        add a,(hl)
        ld (col),a
        xor a
        ld (wlen2),a
        ld (wvis),a
        ret

; colori per tipo di testo: INK e BRIGHT (1 nome stanza, 2 testo, 3 oggetti, 4 uscite, 5 errori, 6 comando del giocatore)
zxcol:  .byte 7,0, 6,1, 7,0, 4,1, 5,1, 2,1, 7,1, 7,0
setcol: ld (fcol),a
        ld a,16
        rst 16
        call zxci
        ld a,(hl)
        rst 16
        ld a,19
        rst 16
        call zxci
        inc hl
        ld a,(hl)
        rst 16
        ret
zxci:   ld a,(fcol)
        add a,a
        ld e,a
        ld d,0
        ld hl,zxcol
        add hl,de
        ret

; scrive il carattere A con a capo automatico tra le parole (32 colonne, ne usa 31)
outc:   push bc
        push de
        push hl
        ld c,a
        cp 13
        jr z,oc_cr
        cp 32
        jr z,oc_sp
        ld a,(wlen2)
        cp 31
        jr c,oc_add
        push bc
        call flushw
        pop bc
        ld a,(wlen2)
oc_add: ld e,a
        ld d,0
        ld hl,WBUF
        add hl,de
        ld (hl),c
        inc a
        ld (wlen2),a
        ld a,c
        cp 8
        jr c,oc_ret
        ld hl,wvis
        inc (hl)
        jr oc_ret
oc_sp:  call flushw
        ld a,(col)
        cp 31
        jr nc,oc_ret
        inc a
        ld (col),a
        ld a,32
        call putc
        jr oc_ret
oc_cr:  call flushw
        ld a,13
        call putc
        xor a
        ld (col),a
oc_ret: pop hl
        pop de
        pop bc
        ret

; stampa la stringa che termina con 0 puntata da HL
prstr:  push bc
        ld b,TKEY
ps1:    ld a,(hl)
        xor b
        jr z,ps_e
        call outc
        ld a,b
        add a,TSTEP
        ld b,a
        inc hl
        jr ps1
ps_e:   pop bc
        ret

; stampa la stringa in chiaro (in RAM) puntata da HL
prplain:
        ld a,(hl)
        or a
        ret z
        call outc
        inc hl
        jr prplain

; stampa il messaggio con id in A
prtext: add a,a
        ld e,a
        ld d,0
        ld hl,(HDR+8)
        add hl,de
        ld a,(hl)
        inc hl
        ld h,(hl)
        ld l,a
        jr prstr

; byte dell'uscita dsel della stanza corrente
exitbyte:
        ld a,(room)
        ld l,a
        ld h,0
        add hl,hl
        add hl,hl
        add hl,hl
        ld bc,(HDR+4)
        add hl,bc
        ld a,(dsel)
        ld e,a
        ld d,0
        add hl,de
        ld a,(hl)
        ret

; stampa le rivelazioni e l'elenco delle uscite visibili
descexits:
        xor a
        ld (dsel),a
dx1:    ld a,(HDR+20)
        ld b,a
        ld a,(dsel)
        cp b
        jr nc,dx2
        call getexit
        ld a,(xst)
        cp 1
        jr nz,dx1n
        ld hl,(xrp)
        ld a,h
        or l
        jr z,dx1n
        call prstr
dx1n:   ld hl,dsel
        inc (hl)
        jr dx1
dx2:    xor a
        ld (dsel),a
        ld (seen),a
dx3:    ld a,(HDR+20)
        ld b,a
        ld a,(dsel)
        cp b
        jr nc,dx_end
        call getexit
        ld a,(xst)
        or a
        jr z,dx3n
        ld a,(seen)
        or a
        ld a,T_VIRG
        jr nz,dx_p
        ld a,T_USC
dx_p:   call prtext
        ld a,(dsel)
        add a,a
        ld e,a
        ld d,0
        ld hl,(HDR+18)
        add hl,de
        ld a,(hl)
        inc hl
        ld h,(hl)
        ld l,a
        call prstr
        ld hl,seen
        inc (hl)
dx3n:   ld hl,dsel
        inc (hl)
        jr dx3
dx_end: ld a,(seen)
        or a
        ret z
        ld a,T_USC+1
        jp prtext

; stampa il testo della stanza corrente e le uscite
describe:
        call pic
        call isdark
        jr nc,ds_ok
        ld a,T_BUIO
        jp prtext
ds_ok:  ld a,(room)
        ld l,a
        ld h,0
        add hl,hl
        ld de,(HDR+2)
        add hl,de
        ld a,(hl)
        inc hl
        ld h,(hl)
        ld l,a
        call prstr
        call descfrag
        ld a,13
        call outc
        ld a,(room)
        ld (lsloc),a
        ld a,T_QUI
        ld (lspre),a
        call listobj
        ld a,32
        ld (lschar),a
        ld a,1
        ld (lsmul),a
        ld a,(room)
        ld (lsloc),a
        ld a,T_PERS
        ld (lspre),a
        call listobj
        xor a
        ld (lschar),a
        ld (lsmul),a
        jp descexits

; ---- regole, condizioni, uscite con condizioni, frammenti ----
; byte successivo del flusso puntato da (rp), con cursore ry; Z se vale 0
nextb:  push hl
        push de
        ld hl,(rp)
        ld a,(ry)
        ld e,a
        ld d,0
        add hl,de
        ld a,(hl)
        ld hl,ry
        inc (hl)
        pop de
        pop hl
        or a
        ret

; valuta una condizione (3 byte: tipo, a, b); carry acceso se vera
chkcond:
        call nextb
        jr nz,cc_k
        call nextb
        ld b,a
        call nextb
        ld a,(room)
        cp b
        jr z,cc_t
        jr cc_f
cc_k:   jp cc_kk
cc_obj: call nextb
        ld e,a
        call nextb
        ld (tmp),a
        cp 4
        jr nc,cc_pos
        ld d,0
        ld hl,ostate
        add hl,de
        ld c,(hl)
        cp 2
        jr nc,cc_lit
        ld a,c
        and 1
        jr cc_bit
cc_lit: ld a,c
        and 2
cc_bit: ld c,a
        ld a,(tmp)
        and 1
        ld a,c
        jr z,cc_nz
        or a
        jr z,cc_t
        jr cc_f
cc_nz:  or a
        jr nz,cc_t
        jr cc_f
cc_pos: ld a,e
        call effloc
        ld c,a
        ld a,(tmp)
        cp 5
        jr z,cc_con
        jr nc,cc_ap
        ld a,(room)
        cp c
        jr z,cc_t
        jr cc_f
cc_con: ld a,c
        cp $FE
        jr z,cc_t
        jr cc_f
cc_ap:  ld a,(room)
        cp c
        jr z,cc_t
        ld a,c
        cp $FE
        jr z,cc_t
cc_f:   or a
        ret
cc_t:   scf
        ret
cc_kk:   cp 2
        jr c,cc_obj
        sub 2
        ld c,a
        call nextb
        ld e,a
        call nextb
        ld b,a
        ld d,0
        ld hl,vars
        add hl,de
        ld a,c
        or a
        ld a,(hl)
        jr nz,cv_1
        cp b
        jr z,cvt
        jr cvf
cv_1:   dec c
        jr nz,cv_2
        cp b
        jr nz,cvt
        jr cvf
cv_2:   dec c
        jr nz,cv_3
        cp b
        jr nc,cvt
        jr cvf
cv_3:   cp b
        jr z,cvt
        jr c,cvt
        jr cvf
cvt:    scf
        ret
cvf:    or a
        ret

; legge il numero di condizioni e le valuta tutte; Z se qualcuna e' falsa
evalconds:
        call nextb
        ld (rn),a
        ld a,1
        ld (rok),a
ev1:    ld a,(rn)
        or a
        jr z,ev_end
        call chkcond
        jr c,ev2
        xor a
        ld (rok),a
ev2:    ld hl,rn
        dec (hl)
        jr ev1
ev_end: ld a,(rok)
        or a
        ret

; informazioni sull'uscita dsel: xst 0 = non c'e' o e' nascosta, 1 = si passa (xtgt), 2 = bloccata (testo in xbp); xrp = rivelazione
getexit:
        xor a
        ld (xst),a
        ld (xbp),a
        ld (xbp+1),a
        ld (xrp),a
        ld (xrp+1),a
        call exitbyte
        or a
        ret z
        bit 7,a
        jr nz,gx_c
        dec a
        ld (xtgt),a
        ld a,1
        ld (xst),a
        ret
gx_c:   and $7F
        add a,a
        ld e,a
        ld d,0
        ld hl,(HDR+16)
        add hl,de
        ld a,(hl)
        inc hl
        ld h,(hl)
        ld l,a
        ld (rp),hl
        xor a
        ld (ry),a
        call nextb
        ld (xtgt),a
        call nextb
        ld (xnas),a
        call evalconds
        push af
        call nextb
        ld (xbp),a
        call nextb
        ld (xbp+1),a
        call nextb
        ld (xrp),a
        call nextb
        ld (xrp+1),a
        pop af
        jr z,gx_no
        ld a,1
        ld (xst),a
        ret
gx_no:  ld a,(xnas)
        or a
        ret nz
        ld a,2
        ld (xst),a
        ret

; aggiunge alla descrizione i frammenti la cui condizione e' vera
descfrag:
        ld a,(room)
        add a,a
        ld e,a
        ld d,0
        ld hl,(HDR+22)
        add hl,de
        ld a,(hl)
        inc hl
        ld h,(hl)
        ld l,a
        or h
        ret z
        ld (rp),hl
        xor a
        ld (ry),a
        call nextb
        ld (fc),a
df2:    ld a,(fc)
        or a
        ret z
        call evalconds
        push af
        call nextb
        ld l,a
        call nextb
        ld h,a
        pop af
        jr z,df4
        push hl
        ld a,32
        call outc
        pop hl
        call prstr
df4:    ld hl,fc
        dec (hl)
        jr df2

; A = oggetto: A se e' qui o con te, altrimenti 255
; slot vuoto? A = base (0 o 4): Z = 1 se non ci sono ne' nomi ne' aggettivi
sempty: ld e,a
        ld d,0
        ld hl,slots
        add hl,de
        ld a,(hl)
        inc hl
        inc hl
        and (hl)
        cp 255
        ret

; come findobj, ma l'ambiguita' vale "nessun oggetto" (per le regole)
; dopo una preposizione solo aggettivi ("chiave di ferro"): passano nel primo oggetto
mergeadj:
        ld a,(slots+4)
        cp 255
        ret nz
        ld hl,slots+6
        call mg_one
        ld hl,slots+7
mg_one: ld a,(hl)
        cp 255
        ret z
        ld b,a
        ld a,(slots+2)
        cp 255
        jr nz,mg_3
        ld a,b
        ld (slots+2),a
        jr mg_c
mg_3:   ld a,(slots+3)
        cp 255
        jr nz,mg_c
        ld a,b
        ld (slots+3),a
mg_c:   ld (hl),255
        ret

; se il primo oggetto e' un personaggio e il secondo un argomento li scambia (prima l'argomento)
swapobj:
        ld a,(robj)
        cp 255
        ret z
        ld a,(robj2)
        cp 255
        ret z
        ld hl,oflags
        ld a,(robj)
        ld e,a
        ld d,0
        add hl,de
        ld a,(hl)
        and 32
        ret z
        ld hl,oflags
        ld a,(robj2)
        ld e,a
        ld d,0
        add hl,de
        ld a,(hl)
        and 64
        ret z
        ld a,(robj)
        ld b,a
        ld a,(robj2)
        ld (robj),a
        ld a,b
        ld (robj2),a
        ret

findtol:
        call findobj
        ld b,a
        ld a,(famb)
        or a
        ld a,b
        ret z
        ld a,255
        ret

; cerca fra gli oggetti presenti (fscope: 1 = in stanza, 2 = con te, 3 = tutti e due) quelli che corrispondono alle
; parole dello slot A (0 o 4): almeno un nome fra quelli dati e tutti gli aggettivi.
; Esce con A = primo oggetto trovato o 255; famb = 1 se piu' oggetti rispondono allo stesso nome (o solo agli aggettivi)
findobj:
        ld (fx),a
        xor a
        ld (famb),a
        ld (fc0),a
        ld (fc1),a
        ld (ftot),a
        ld a,255
        ld (ffirst),a
        ld a,(fx)
        call sempty
        jr nz,fo_go
        ld a,255
        ret
fo_go:  call isdark
        ld a,0
        rla
        ld (fdark),a
        ld a,(fx)
        ld e,a
        ld d,0
        ld hl,slots
        add hl,de
        ld (fsp),hl
        ld hl,(HDR+28)
        xor a
        ld (fi),a
fo_loop:
        ld a,(HDR+10)
        ld b,a
        ld a,(fi)
        cp b
        jp nc,fo_end
        xor a
        ld (fm0),a
        ld (fm1),a
        ld (fa0),a
        ld (fa1),a
        ld a,(hl)
        inc hl
        or a
        jr z,fo_nd
        ld b,a
fo_n:   ld a,(hl)
        inc hl
        ld c,a
        push hl
        ld hl,(fsp)
        ld a,(hl)
        cp c
        jr nz,fo_n1
        ld a,1
        ld (fm0),a
fo_n1:  inc hl
        ld a,(hl)
        cp c
        jr nz,fo_n2
        ld a,1
        ld (fm1),a
fo_n2:  pop hl
        djnz fo_n
fo_nd:  ld a,(hl)
        inc hl
        or a
        jr z,fo_ad
        ld b,a
fo_a:   ld a,(hl)
        inc hl
        ld c,a
        push hl
        ld hl,(fsp)
        inc hl
        inc hl
        ld a,(hl)
        cp c
        jr nz,fo_a1
        ld a,1
        ld (fa0),a
fo_a1:  inc hl
        ld a,(hl)
        cp c
        jr nz,fo_a2
        ld a,1
        ld (fa1),a
fo_a2:  pop hl
        djnz fo_a
fo_ad:  ld (fnext),hl
        ld hl,(fsp)
        inc hl
        inc hl
        ld a,(hl)
        cp 255
        jr z,fo_c2
        ld a,(fa0)
        or a
        jp z,fo_next
fo_c2:  inc hl
        ld a,(hl)
        cp 255
        jr z,fo_c3
        ld a,(fa1)
        or a
        jr z,fo_next
fo_c3:  ld hl,(fsp)
        ld a,(hl)
        inc hl
        and (hl)
        cp 255
        jr z,fo_c4
        ld a,(fm0)
        ld b,a
        ld a,(fm1)
        or b
        jr z,fo_next
fo_c4:  ld a,(fi)
        ld e,a
        ld d,0
        ld hl,oflags
        add hl,de
        ld a,(hl)
        and 64
        jr z,fo_c4n
        ld a,(fscope)
        and 4
        jr z,fo_next
        jr fo_cand
fo_c4n: ld a,(fi)
        call effloc
        ld hl,room
        cp (hl)
        jr nz,fo_c5
        ld a,(fscope)
        and 1
        jr z,fo_next
        ld a,(fdark)
        or a
        jr nz,fo_next
        jr fo_cand
fo_c5:  cp $FE
        jr nz,fo_next
        ld a,(fscope)
        and 2
        jr z,fo_next
fo_cand:
        ld a,(ffirst)
        cp 255
        jr nz,fo_k
        ld a,(fi)
        ld (ffirst),a
fo_k:   ld hl,ftot
        inc (hl)
        ld a,(fm0)
        or a
        jr z,fo_k1
        ld hl,fc0
        inc (hl)
fo_k1:  ld a,(fm1)
        or a
        jr z,fo_next
        ld hl,fc1
        inc (hl)
fo_next:
        ld hl,fi
        inc (hl)
        ld hl,(fnext)
        jp fo_loop
fo_end: ld hl,(fsp)
        ld a,(hl)
        inc hl
        and (hl)
        cp 255
        jr z,fo_nn
        ld a,(fc0)
        cp 2
        jr nc,fo_amb
        ld a,(fc1)
        cp 2
        jr nc,fo_amb
        jr fo_ret
fo_nn:  ld a,(ftot)
        cp 2
        jr c,fo_ret
fo_amb: ld a,1
        ld (famb),a
fo_ret: ld a,(ffirst)
        ret

; HL = stato dell'oggetto letto dal flusso
stptr:  call nextb
        ld e,a
        ld d,0
        ld hl,ostate
        add hl,de
        ret

; prova le regole in ordine; NZ se una ha agito
; regola: [lunghezza][comando][oggetto o 255][con o 255][n condizioni][condizioni][testo altrimenti (2)][azioni...][0]
runrules:
        ld hl,(HDR+14)
        ld (rp),hl
rr_next:
        ld hl,(rp)
        ld a,(hl)
        or a
        ret z
        inc hl
        ld a,(verb)
        cp (hl)
        jr nz,rr_skip
        inc hl
        ld a,(hl)
        cp 255
        jr z,rr_o2
        ld b,a
        ld a,(robj)
        cp b
        jr nz,rr_skip
rr_o2:  inc hl
        ld a,(hl)
        cp 255
        jr z,rr_c
        ld b,a
        ld a,(robj2)
        cp b
        jr nz,rr_skip
rr_c:   ld a,255
        ld (copen),a
        ld a,4
        ld (ry),a
        call evalconds
        push af
        call nextb
        ld l,a
        call nextb
        ld h,a
        pop af
        jr nz,rr_act
        ld a,h
        or l
        jr z,rr_skip
        call prstr
        ld a,1
        or a
        ret
rr_skip:
        ld hl,(rp)
        ld a,(hl)
        ld e,a
        ld d,0
        add hl,de
        inc hl
        ld (rp),hl
        jr rr_next
rr_act: call nextb
        jp z,ra_done
        cp 1
        jr nz,ra_2
        call nextb
        ld l,a
        call nextb
        ld h,a
        call prstr
        jp rr_act
ra_2:   cp 2
        jr nz,ra_3
        call nextb
        ld e,a
        call nextb
        ld c,a
        ld d,0
        ld hl,objloc
        add hl,de
        ld (hl),c
        jp rr_act
ra_3:   cp 3
        jr nz,ra_4
        call stptr
        set 0,(hl)
        ld a,e
        ld (copen),a
        jp rr_act
ra_4:   cp 4
        jr nz,ra_5
        call stptr
        res 0,(hl)
        jp rr_act
ra_5:   cp 5
        jr nz,ra_6
        call stptr
        set 1,(hl)
        jp rr_act
ra_6:   cp 6
        jr nz,ra_7
        call stptr
        res 1,(hl)
        jp rr_act
ra_7:   cp 7
        jr nz,ra_8
        ld hl,(rp)
        push hl
        ld a,(ry)
        push af
        call describe
        pop af
        ld (ry),a
        pop hl
        ld (rp),hl
        jp rr_act
ra_8:   cp 8
        jr nz,ra_9
        call nextb
        ld l,a
        call nextb
        ld h,a
        call prstr
        ld a,T_FINE
        call prtext
        ld a,1
        ld (fin),a
        jp rr_act
ra_9:   cp 9
        jr nz,ra_10
        call nextb
        ld e,a
        call nextb
        ld c,a
        ld d,0
        ld hl,vars
        add hl,de
        ld (hl),c
        jp rr_act
ra_10:  cp 10
        jr nz,ra_11
        call nextb
        ld e,a
        call nextb
        ld c,a
        call nextb
        ld b,a
        ld d,0
        ld hl,vars
        add hl,de
        ld a,(hl)
        add a,c
        jr c,ra10m
        cp b
        jr c,ra10s
ra10m:  ld a,b
ra10s:  ld (hl),a
        jp rr_act
ra_11:  call nextb
        ld e,a
        call nextb
        ld c,a
        ld d,0
        ld hl,vars
        add hl,de
        ld a,(hl)
        sub c
        jr nc,ra11s
        xor a
ra11s:  ld (hl),a
        jp rr_act
ra_done:
        ld a,(copen)
        cp 255
        call nz,showcont
        ld a,(rmode)
        or a
        jr z,rd_n
        ld a,(fin)
        or a
        jp z,rr_skip
rd_n:   ld a,1
        or a
        ret

; ---- oggetti ----
; posizione effettiva dell'oggetto A: risale i contenitori ($80+k = dentro l'oggetto k); $FF se e' dentro un contenitore chiuso.
; Usa B, DE, HL.
effloc: ld b,8
        ld e,a
        ld d,0
        ld hl,objloc
        add hl,de
        ld a,(hl)
el1:    cp $80
        ret c
        cp $FE
        ret nc
        and $7F
        ld e,a
        ld hl,oflags
        add hl,de
        bit 4,(hl)
        jr z,el2
        ld hl,ostate
        add hl,de
        bit 0,(hl)
        jr z,el_h
el2:    ld hl,objloc
        add hl,de
        ld a,(hl)
        djnz el1
el_h:   ld a,$FF
        ret

; se l'oggetto A e' un contenitore aperto, scrive che cosa c'e' dentro
showcont:
        ld e,a
        ld d,0
        ld hl,oflags
        add hl,de
        bit 3,(hl)
        ret z
        bit 4,(hl)
        jr z,sc1
        ld hl,ostate
        add hl,de
        bit 0,(hl)
        ret z
sc1:    ld a,e
        or $80
        ld (lsloc),a
        ld a,T_DENTRO
        ld (lspre),a
        call listobj
        or a
        ret nz
        ld a,T_VUOTO
        jp prtext

; HL = record dell'oggetto idx
objptr: ld a,(idx)
        ld l,a
        ld h,0
        add hl,hl
        add hl,hl
        add hl,hl
        add hl,hl
        ld de,(HDR+12)
        add hl,de
        ret

; carry acceso se l'oggetto idx va nell'elenco di lsloc
fits:   ld a,(idx)
        ld e,a
        ld d,0
        ld hl,objloc
        add hl,de
        ld a,(lsloc)
        cp (hl)
        jr nz,fits_no
        call objptr
        push hl
        inc hl
        ld a,(hl)
        ld (lsfl),a
        pop hl
        ld a,(lsloc)
        cp $80
        jr nc,fits_f4
        ld a,(lsfl)
        and 32
        ld b,a
        ld a,(lschar)
        cp b
        jr nz,fits_no
fits_f4:
        ld a,(lsloc)
        cp $FE
        jr nc,fits_yes
        ld a,(lsfl)
        and 4
        jr z,fits_yes
        ld a,(lsloc)
        cp (hl)
        jr z,fits_no
fits_yes:
        scf
        ret
fits_no:
        or a
        ret

; elenca gli oggetti che stanno in lsloc con il testo lspre prima e lspre+1 dopo; restituisce il numero in A
listobj:
        xor a
        ld (cnt),a
        ld (idx),a
lo1:    ld a,(HDR+10)
        ld b,a
        ld a,(idx)
        cp b
        jr nc,lo2
        call fits
        jr nc,lo1n
        ld hl,cnt
        inc (hl)
lo1n:   ld hl,idx
        inc (hl)
        jr lo1
lo2:    ld a,(cnt)
        or a
        ret z
        ld a,(lsmul)
        or a
        jr z,lo2c
        ld a,(cnt)
        cp 2
        jr c,lo2c
        ld a,(lspre)
        add a,2
        ld (lspre),a
lo2c:   ld a,(lspre)
        call prtext
        xor a
        ld (idx),a
        ld (seen),a
lo3:    ld a,(HDR+10)
        ld b,a
        ld a,(idx)
        cp b
        jr nc,lo_end
        call fits
        jr nc,lo3n
        ld a,(seen)
        or a
        jr z,lo_ns
        ld b,a
        ld a,(cnt)
        dec a
        cp b
        ld a,T_E
        jr z,lo_sep
        ld a,T_VIRG
lo_sep: call prtext
lo_ns:  ld a,2
        call getptr
        call prstr
        ld hl,seen
        inc (hl)
lo3n:   ld hl,idx
        inc (hl)
        jr lo3
lo_end: ld a,(lspre)
        inc a
        call prtext
        ld a,(cnt)
        ret

; HL = puntatore al record + A; carica il puntatore che vi si trova (Z se nullo)
ldptr:  ld hl,(rec)
        ld e,a
        ld d,0
        add hl,de
        ld a,(hl)
        inc hl
        ld h,(hl)
        ld l,a
        or h
        ret

; HL = testo dell'oggetto idx (A = 2 etichetta, 4 descrizione), secondo il suo stato
getptr: ld (tmp),a
        call objptr
        ld (rec),hl
        ld a,(idx)
        ld e,a
        ld d,0
        ld hl,ostate
        add hl,de
        ld c,(hl)
        bit 0,c
        jr z,gp_a
        ld a,(tmp)
        add a,4
        call ldptr
        ret nz
gp_a:   bit 1,c
        jr z,gp_b
        ld a,(tmp)
        add a,8
        call ldptr
        ret nz
gp_b:   ld a,(tmp)
        jr ldptr

; guarda [oggetto]
do_guarda:
        ld a,(pbase)
        call sempty
        jp z,describe
        ld a,3
        ld (fscope),a
        ld a,(pbase)
        call findobj
        ld b,a
        ld a,(famb)
        or a
        jp nz,amb_msg
        ld a,b
        cp 255
        jr nz,dg1
        ld a,T_NONPRE
        jp prtext
dg1:    ld (idx),a
        ld a,4
        call getptr
        call prstr
        ld a,(idx)
        jp showcont
amb_msg:
        ld a,T_QUALE
        jp prtext

; ripeti: rifa' l'ultimo comando (LAST non contiene mai «ripeti»)
do_ripeti:
        ld a,(LAST)
        or a
        jr nz,rp_ok
        ld a,T_NIENTE
        jp prtext
rp_ok:  ld hl,LAST
        ld de,LINE
        ld bc,29
        ldir
        jp execute

; l'oggetto trovato nello slot pbase e' «tutto»? (flag 128): carry acceso se si'
istutto:
        ld a,7
        ld (fscope),a
        ld a,(pbase)
        call findobj
        ld b,a
        ld a,(famb)
        or a
        jr nz,it_no
        ld a,b
        cp 255
        jr z,it_no
        ld e,a
        ld d,0
        ld hl,oflags
        add hl,de
        bit 7,(hl)
        jr z,it_no
        scf
        ret
it_no:  or a
        ret

; stampa «etichetta: » dell'oggetto idx
ta_label:
        ld a,T_COLTXT
        call prtext
        ld a,2
        call getptr
        call prstr
        ld a,T_DUEP
        jp prtext

; carry acceso se la stanza e' buia e nessuna fonte di luce accesa e' qui o con te (HDR+30 = tabella per stanza, 0 = nessuna stanza buia)
isdark: ld hl,(HDR+30)
        ld a,h
        or l
        jr z,id_no
        ld a,(room)
        ld e,a
        ld d,0
        add hl,de
        ld a,(hl)
        or a
        jr z,id_no
        xor a
        ld (dtmp),a
id_l:   ld a,(HDR+10)
        ld b,a
        ld a,(dtmp)
        cp b
        jr nc,id_yes
        ld e,a
        ld d,0
        ld hl,oflags
        add hl,de
        bit 1,(hl)
        jr z,id_n
        ld hl,ostate
        add hl,de
        bit 1,(hl)
        jr z,id_n
        ld a,(dtmp)
        call effloc
        ld hl,room
        cp (hl)
        jr z,id_no
        cp $FE
        jr z,id_no
id_n:   ld hl,dtmp
        inc (hl)
        jr id_l
id_yes: scf
        ret
id_no:  or a
        ret

; prendi tutto: ogni oggetto prendibile che sta in stanza, uno per riga
takeall:
        call isdark
        jr nc,ta_ok0
        ld a,T_NIENTEPR
        jp prtext
ta_ok0: xor a
        ld (tai),a
        ld (tcnt),a
ta_l:   ld a,(HDR+10)
        ld b,a
        ld a,(tai)
        cp b
        jr nc,ta_end
        ld (idx),a
        xor a
        ld (lschar),a
        ld a,(room)
        ld (lsloc),a
        call fits
        jr nc,ta_n
        ld a,(tai)
        ld e,a
        ld d,0
        ld hl,oflags
        add hl,de
        bit 0,(hl)
        jr z,ta_n
        ld hl,tcnt
        inc (hl)
        call ta_label
        ld a,(tai)
        ld (robj),a
        ld a,255
        ld (robj2),a
        ld a,3
        ld (verb),a
        call runrules
        jr nz,ta_r
        ld a,(tai)
        ld e,a
        ld d,0
        ld hl,objloc
        add hl,de
        ld (hl),$FE
        ld a,T_PRESO
        call prtext
ta_r:   ld a,(fin)
        or a
        ret nz
ta_n:   ld hl,tai
        inc (hl)
        jr ta_l
ta_end: ld a,(tcnt)
        or a
        ret nz
        ld a,T_NIENTEPR
        jp prtext

; lascia tutto: ogni oggetto che hai con te
leaveall:
        xor a
        ld (tai),a
        ld (tcnt),a
la_l:   ld a,(HDR+10)
        ld b,a
        ld a,(tai)
        cp b
        jr nc,la_end
        ld (idx),a
        xor a
        ld (lschar),a
        ld a,$FE
        ld (lsloc),a
        call fits
        jr nc,la_n
        ld hl,tcnt
        inc (hl)
        call ta_label
        ld a,(tai)
        ld (robj),a
        ld a,255
        ld (robj2),a
        ld a,4
        ld (verb),a
        call runrules
        jr nz,la_r
        ld a,(tai)
        ld e,a
        ld d,0
        ld hl,objloc
        add hl,de
        ld a,(room)
        ld (hl),a
        ld a,T_LASCIA
        call prtext
la_r:   ld a,(fin)
        or a
        ret nz
la_n:   ld hl,tai
        inc (hl)
        jr la_l
la_end: ld a,(tcnt)
        or a
        ret nz
        ld a,T_NIENTELA
        jp prtext

; prendi oggetto
do_prendi:
        ld a,(pbase)
        call sempty
        jr nz,dp0
        ld a,T_COSAPR
        jp prtext
dp0:    call istutto
        jp c,takeall
        ld a,1
        ld (fscope),a
        ld a,(pbase)
        call findobj
        ld b,a
        ld a,(famb)
        or a
        jp nz,amb_msg
        ld a,b
        cp 255
        jr nz,dp3
        ld a,2
        ld (fscope),a
        ld a,(pbase)
        call findobj
        ld b,a
        ld a,(famb)
        or a
        jp nz,amb_msg
        ld a,b
        cp 255
        jr z,dp2
        ld e,a
        ld d,0
        ld hl,objloc
        add hl,de
        ld a,(hl)
        cp $FE
        ld a,e
        jr nz,dp3
        ld a,T_GIA
        jp prtext
dp2:    ld a,T_NONPRE
        jp prtext
dp3:    ld (obj),a
        ld (idx),a
        call objptr
        inc hl
        ld a,(hl)
        and 32
        jr z,dp3b
        ld a,T_NOPERS
        jp prtext
dp3b:   ld a,(hl)
        and 1
        jr nz,dp4
        ld a,T_NONPRN
        jp prtext
dp4:    ld a,(obj)
        ld e,a
        ld d,0
        ld hl,objloc
        add hl,de
        ld (hl),$FE
        ld a,T_PRESO
        jp prtext

; lascia oggetto
do_lascia:
        ld a,(pbase)
        call sempty
        jr nz,dl0
        ld a,T_COSALA
        jp prtext
dl0:    call istutto
        jp c,leaveall
        ld a,2
        ld (fscope),a
        ld a,(pbase)
        call findobj
        ld b,a
        ld a,(famb)
        or a
        jp nz,amb_msg
        ld a,b
        cp 255
        jr nz,dl2
        ld a,T_NONHAI
        jp prtext
dl2:    ld e,a
        ld d,0
        ld hl,objloc
        add hl,de
        ld a,(room)
        ld (hl),a
        ld a,T_LASCIA
        jp prtext

; metti oggetto (con te) in contenitore (presente e aperto, non dentro l'oggetto)
do_metti:
        xor a
        call sempty
        jr z,dm_cosa
        ld a,4
        call sempty
        jr z,dm_cosa
        ld a,2
        ld (fscope),a
        xor a
        call findobj
        ld b,a
        ld a,(famb)
        or a
        jp nz,amb_msg
        ld a,b
        cp 255
        jr nz,dm2
        ld a,T_NONHAI
        jp prtext
dm_cosa:
        ld a,T_METTI
        jp prtext
dm2:    ld (obj),a
        ld a,3
        ld (fscope),a
        ld a,4
        call findobj
        ld b,a
        ld a,(famb)
        or a
        jp nz,amb_msg
        ld a,b
        cp 255
        jr nz,dm5
        ld a,T_NONPRE
        jp prtext
dm5:    ld (obj2),a
        ld e,a
        ld d,0
        ld hl,oflags
        add hl,de
        bit 3,(hl)
        jr z,dm_no
        ld a,(obj)
        ld c,a
        ld a,(obj2)
dm7:    cp c
        jr z,dm_no
        ld e,a
        ld hl,objloc
        add hl,de
        ld a,(hl)
        cp $80
        jr c,dm8
        cp $FE
        jr nc,dm8
        and $7F
        jr dm7
dm8:    ld a,(obj2)
        ld e,a
        ld hl,oflags
        add hl,de
        bit 4,(hl)
        jr z,dm9
        ld hl,ostate
        add hl,de
        bit 0,(hl)
        jr nz,dm9
        ld a,T_CHIUSO
        jp prtext
dm9:    ld a,(obj)
        ld e,a
        ld hl,objloc
        add hl,de
        ld a,(obj2)
        or $80
        ld (hl),a
        ld a,T_MESSO
        jp prtext
dm_no:  ld a,T_NONCON
        jp prtext

; inventario
do_inv: ld a,$FE
        ld (lsloc),a
        ld a,T_INV
        ld (lspre),a
        call listobj
        or a
        ret nz
        ld a,T_INVVUO
        jp prtext

; ---- tastiera: lettura diretta della matrice ----
; Ogni tasto viene riconosciuto quando passa da rilasciato a premuto, anche se un altro tasto e' ancora giu':
; si puo' battere veloce. Lo stesso tasto non viene accettato di nuovo nello stesso fotogramma (20 ms) in cui l'ultima volta che
; era premuto, per ignorare i rimbalzi dei contatti.
scanall:
        ld hl,CUR
        ld b,$FE
        ld d,8
sa1:    ld c,$FE
        in a,(c)
        cpl
        and $1F
        ld (hl),a
        inc hl
        rlc b
        dec d
        jr nz,sa1
        ret

; aggiorna lastseen se l'ultimo tasto accettato e' ancora premuto
touch:  ld a,(lastmask)
        or a
        ret z
        ld hl,CUR
        ld a,(lastrow)
        ld e,a
        ld d,0
        add hl,de
        ld a,(lastmask)
        and (hl)
        ret z
        ld a,(FRAMES)
        ld (lastseen),a
        or 1
        ret

; aspetta un nuovo tasto e restituisce il carattere (8 = cancella, 13 = invio)
getkey: call scanall
        ld a,(CUR)
        and 1
        ld (kcs),a
        ld a,(CUR)
        and $1E
        ld (CUR),a
        ld a,(CUR+7)
        and $1D
        ld (CUR+7),a
        ld hl,CUR
        ld de,HELD
        ld b,8
gk1:    ld a,(de)
        and (hl)
        ld (de),a
        inc hl
        inc de
        djnz gk1
        ld hl,CUR
        ld de,HELD
        ld b,8
        ld c,0
gk2:    ld a,(de)
        cpl
        and (hl)
        jr nz,gk_new
        inc hl
        inc de
        inc c
        djnz gk2
        call touch
        jp z,getkey
        ld a,(lchr)
        cp 13
        jp z,getkey
        ld a,(FRAMES)
        ld hl,repnext
        sub (hl)
        cp 128
        jp c,gk_rep
        jp getkey
gk_rep: ld a,(FRAMES)
        add a,3
        ld (repnext),a
        ld a,(lchr)
        ld (kk),a
        jr gk_map
gk_new: ld e,a
        neg
        and e
        ld (nmask),a
        ld b,0
gk3:    srl a
        jr z,gk4
        inc b
        jr gk3
gk4:    ld a,c
        add a,a
        add a,a
        add a,c
        add a,b
        ld e,a
        ld d,0
        ld hl,KEYTAB
        add hl,de
        ld a,(hl)
        ld (kk),a
        ld hl,HELD
        ld e,c
        ld d,0
        add hl,de
        ld a,(nmask)
        or (hl)
        ld (hl),a
        ld a,(lastrow)
        cp c
        jr nz,gk_ok
        ld a,(lastmask)
        ld e,a
        ld a,(nmask)
        cp e
        jr nz,gk_ok
        ld a,(FRAMES)
        ld hl,lastseen
        sub (hl)
        cp 1
        jr nc,gk_ok
        ld a,(FRAMES)
        ld (lastseen),a
        jp getkey
gk_ok:  ld a,c
        ld (lastrow),a
        ld a,(nmask)
        ld (lastmask),a
        ld a,(FRAMES)
        ld (lastseen),a
        add a,25
        ld (repnext),a
        ld a,(kk)
        ld (lchr),a
gk_map: ld a,(kk)
        cp '0'
        jr nz,gk_ret
        ld a,(kcs)
        or a
        ld a,(kk)
        jr z,gk_ret
        ld a,8
gk_ret: ret

; scrive A, poi il cursore "_" e torna indietro
echo:   rst 16
cursor: ld a,'_'
        rst 16
        ld a,8
        rst 16
        ret

; legge una riga da tastiera in LINE (massimo 28 caratteri, terminata da 0)
; ---- uscita del testo: a righe (come la ROM) o a blocchi, con pausa quando lo schermo e' pieno ----
; HDR+11: bit 0 = a blocchi, bit 1 = attesa di un tasto dopo l'introduzione.
; putc scrive il carattere A (codici 0-7 = colore). A blocchi lo mette in BUF e conta le righe;
; flushb fa scorrere lo schermo una volta sola, di quanto serve, e poi stampa il blocco.
putc:   ld (pch),a
        push bc
        push de
        push hl
        cp 32
        jr c,pu_t
        ld a,1
        ld (tout),a
pu_t:
        ld a,(dflag)
        or a
        jr nz,pu_dir
        ld a,(HDR+11)
        rra
        jr c,pu_blk
pu_dir: ld a,(pch)
        cp 8
        jr nc,pu_out
        call setcol
        jr pu_end
pu_out: cp 13
        jr nz,pu_o2
        ld a,(itop)
        or a
        jr z,pu_o2
        ld a,(SPOSN+1)
        cp 3
        jr nz,pu_o2
        ld a,1
        ld (kkz),a
        call scrollk
        ld a,21
        ld (frow),a
        xor a
        call atrc
        jr pu_o3
pu_o2:  ld a,(pch)
        rst 16
pu_o3:  ld a,(pch)
        cp 13
        jr nz,pu_end
        ld a,255
        ld (SCRCT),a
        ld a,(dflag)
        or a
        jr nz,pu_end
        ld hl,nlin
        inc (hl)
        ld a,(hl)
        ld hl,nrig
        cp (hl)
        call nc,more
pu_end: pop hl
        pop de
        pop bc
        ld a,(pch)
        ret
pu_blk: ld hl,(bptr)
        ld a,(pch)
        ld (hl),a
        inc hl
        ld (bptr),hl
        cp 13
        jr nz,pb2
        ld hl,nlin
        inc (hl)
        ld a,(hl)
        ld hl,nrig
        cp (hl)
        jr c,pb2
        call flushb
        call more
        jr pu_end
pb2:    ld a,(bptr+1)
        cp $F9
        call nc,flushb
        jr pu_end

flushb: ld hl,(bptr)
        ld de,BUF
        or a
        sbc hl,de
        ret z
        ld a,(SPOSN+1)
        ld b,a
        ld a,24
        sub b
        ld (frow),a
        ld hl,nlin
        add a,(hl)
        sub 21
        jr c,fb_p
        jr z,fb_p
        ld b,a
        ld a,22
        ld hl,itop
        sub (hl)
        cp b
        jr c,fb1
        ld a,b
fb1:    ld (kkz),a
        call scrollk
        ld a,(kkz)
        ld b,a
        ld a,(frow)
        ld hl,itop
        sub b
        jr c,fb0
        cp (hl)
        jr nc,fb2
fb0:    ld a,(hl)
fb2:    ld (frow),a
        ld a,(SPOSN)
        ld b,a
        ld a,33
        sub b
        call atrc
fb_p:   ld a,255
        ld (SCRCT),a
        ld hl,BUF
fb_l:   ld de,(bptr)
        or a
        sbc hl,de
        add hl,de
        jr z,fb_e
        ld a,(hl)
        push hl
        cp 8
        jr nc,fb_c
        call setcol
        jr fb_n
fb_c:   rst 16
fb_n:   pop hl
        inc hl
        jr fb_l
fb_e:   ld hl,BUF
        ld (bptr),hl
        xor a
        ld (nlin),a
        ret
; stampa AT frow, A
atrc:   push af
        ld a,22
        rst 16
        ld a,(frow)
        rst 16
        pop af
        rst 16
        ret

; fa scorrere in su di kkz righe (1-22) le 22 righe in alto (pixel e attributi), poi pulisce quelle liberate
scrollk:
        ld a,(itop)
        ld c,a
sk1:    ld a,(kkz)
        add a,c
        cp 22
        jr nc,sk_c
        ld b,a
        push bc
        call rowadr
        push hl
        ld a,c
        call rowadr
        ex de,hl
        pop hl
        ld b,8
sk2:    push bc
        push hl
        push de
        ld bc,32
        ldir
        pop de
        pop hl
        inc h
        inc d
        pop bc
        djnz sk2
        pop bc
        push bc
        ld a,b
        call attadr
        push hl
        ld a,c
        call attadr
        ex de,hl
        pop hl
        ld bc,32
        ldir
        pop bc
        inc c
        jr sk1
sk_c:   ld a,c
        cp 22
        ret nc
        push bc
        call rowadr
        ld b,8
sk3:    push bc
        push hl
        ld d,h
        ld e,l
        inc de
        ld (hl),0
        ld bc,31
        ldir
        pop hl
        inc h
        pop bc
        djnz sk3
        pop bc
        push bc
        ld a,c
        call attadr
        ld a,(ATTRP)
        ld (hl),a
        ld d,h
        ld e,l
        inc de
        ld bc,31
        ldir
        pop bc
        inc c
        jr sk_c
; indirizzo della prima riga di pixel della riga di testo A
rowadr: ld l,a
        and $18
        or $40
        ld h,a
        ld a,l
        and 7
        rrca
        rrca
        rrca
        ld l,a
        ret
; indirizzo degli attributi della riga A
attadr: ld l,a
        ld h,0
        add hl,hl
        add hl,hl
        add hl,hl
        add hl,hl
        add hl,hl
        ld a,h
        add a,$58
        ld h,a
        ret

; immagine della stanza (HDR+32: tabella, 2 byte per stanza; record [colonne][righe][pixel per riga di caratteri][attributi]).
; Se cambia: pulisce lo schermo (dopo un tasto, se c'e' testo nuovo da leggere), la disegna in alto e il testo scorre sotto.
; Senza immagine (o al buio) il testo torna a tutto schermo e la vecchia immagine scorre via con il testo.
pic:    ld hl,0
        call isdark
        jr c,pi_set
        ld hl,(HDR+32)
        ld a,h
        or l
        jr z,pi_set
        ld a,(room)
        ld e,a
        ld d,0
        add hl,de
        add hl,de
        ld a,(hl)
        inc hl
        ld h,(hl)
        ld l,a
pi_set: ld de,(curimg)
        or a
        sbc hl,de
        add hl,de
        ret z
        ld (curimg),hl
        ld a,h
        or l
        jr nz,pi_drw
        ld (itop),a
        ld a,NRIGHE
        ld (nrig),a
        ret
pi_drw: push hl
        call flushw
        call flushb
        ld a,(tout)
        or a
        call nz,more
        call $0D6B
        ld a,2
        call $1601
        pop hl
        ld a,(hl)
        ld (pcol),a
        ld b,a
        ld a,32
        sub b
        srl a
        ld (px0),a
        inc hl
        ld a,(hl)
        ld (itop),a
        ld b,a
        ld a,NRIGHE
        sub b
        ld (nrig),a
        inc hl
        xor a
        ld (prow),a
pi_r:   push hl
        ld a,(prow)
        call rowadr
        call pi_x
        ld b,8
pi_y:   push bc
        push de
        call pi_cp
        pop de
        inc d
        pop bc
        djnz pi_y
        call pi_nx
        jr nz,pi_r
pi_a:   push hl
        ld a,(prow)
        call attadr
        call pi_x
        call pi_cp
        call pi_nx
        jr nz,pi_a
        ld a,(itop)
        ld (frow),a
        xor a
        ld (col),a
        ld (nlin),a
        ld (tout),a
        jp atrc
; DE = HL + px0 (destinazione sullo schermo), HL = sorgente
pi_x:   ld a,(px0)
        add a,l
        ld e,a
        ld d,h
        pop bc
        pop hl
        push bc
        ret
pi_cp:  ld a,(pcol)
        ld c,a
        ld b,0
        ldir
        ret
; riga successiva; Z quando le righe dell'immagine sono finite (e riparte da 0 per gli attributi)
pi_nx:  ld a,(prow)
        inc a
        ld (prow),a
        ld b,a
        ld a,(itop)
        cp b
        ret nz
        xor a
        ld (prow),a
        ret

; scrive «premi un tasto», aspetta un tasto e cancella la riga (kwait = 1 mentre aspetta: serve ai test)
more:   ld a,1
        ld (dflag),a
        ld a,T_TASTO
        call prdir
        call waitkey
        xor a
        ld (tout),a
        ld a,(SPOSN+1)
        ld b,a
        ld a,24
        sub b
        ld (frow),a
        xor a
        call atrc
        ld b,31
mo1:    ld a,32
        push bc
        rst 16
        pop bc
        djnz mo1
        xor a
        call atrc
        xor a
        ld (dflag),a
        inc a
        ld (nlin),a
        ret
waitkey:
        ld a,1
        ld (kwait),a
wk1:    call kscan
        jr nz,wk1
wk2:    call kscan
        jr z,wk2
wk3:    call kscan
        jr nz,wk3
        xor a
        ld (kwait),a
        ret
kscan:  xor a
        in a,($FE)
        cpl
        and $1F
        ret
; stampa direttamente il messaggio A (senza passare per outc)
prdir:  add a,a
        ld e,a
        ld d,0
        ld hl,(HDR+8)
        add hl,de
        ld a,(hl)
        inc hl
        ld h,(hl)
        ld l,a
        ld b,TKEY
pd1:    ld a,(hl)
        xor b
        ret z
        push hl
        push bc
        cp 8
        jr nc,pd2
        call setcol
        jr pd3
pd2:    rst 16
pd3:    pop bc
        pop hl
        ld a,b
        add a,TSTEP
        ld b,a
        inc hl
        jr pd1

readline:
        xor a
        ld (llen),a
        call cursor
rl1:    call getkey
        cp 13
        jr z,rl_done
        cp 8
        jr z,rl_del
        cp 32
        jr c,rl1
        cp 123
        jr nc,rl1
        ld c,a
        ld a,(llen)
        cp 28
        jr nc,rl1
        ld e,a
        ld d,0
        ld hl,LINE
        add hl,de
        ld (hl),c
        inc a
        ld (llen),a
        ld a,c
        call echo
        jr rl1
rl_del: ld a,(llen)
        or a
        jr z,rl1
        dec a
        ld (llen),a
        ld a,32
        rst 16
        ld a,8
        rst 16
        ld a,8
        rst 16
        call cursor
        jr rl1
rl_done:
        ld a,(llen)
        ld e,a
        ld d,0
        ld hl,LINE
        add hl,de
        ld (hl),0
        ld a,32
        rst 16
        ld a,13
        call putc
        ret

; cerca WORD (lunghezza wlen) nel vocabolario: wtype (0 = sconosciuta) e wid
lookup: xor a
        ld (wtype),a
        ld hl,(HDR+6)
lk_next:
        ld a,(hl)
        or a
        ret z
        ld b,a
        ld a,(wlen)
        cp b
        jr nz,lk_skip
        push hl
        inc hl
        ld de,WORD
lk_cmp: ld a,(hl)
        xor VKEY
        ld c,a
        ld a,(de)
        cp c
        jr nz,lk_pop
        inc hl
        inc de
        djnz lk_cmp
        pop bc
        ld a,(hl)
        ld (wtype),a
        inc hl
        ld a,(hl)
        ld (wid),a
        ret
lk_pop: pop hl
lk_skip:
        ld a,(hl)
        ld e,a
        ld d,0
        add hl,de
        inc hl
        inc hl
        inc hl
        jr lk_next

prword: ld hl,WORD
        jp prplain

; interpreta la riga in LINE
execute:
        xor a
        ld (verb),a
        ld (lpos),a
        ld (nwords),a
        ld a,255
        ld (dirv),a
        ld hl,slots
        ld b,8
ex_i:   ld (hl),a
        inc hl
        djnz ex_i
        xor a
        ld (cs),a
ex_sk:  ld a,(lpos)
        ld e,a
        ld d,0
        ld hl,LINE
        add hl,de
        ld a,(hl)
        or a
        jp z,ex_end
        cp 32
        jr nz,ex_word
        ld hl,lpos
        inc (hl)
        jr ex_sk
ex_word:
        ld de,WORD
        ld b,0
ex_cp:  push de
        ld a,(lpos)
        ld e,a
        ld d,0
        ld hl,LINE
        add hl,de
        pop de
        ld a,(hl)
        or a
        jr z,ex_cpe
        cp 32
        jr z,ex_cpe
        ld c,a
        ld a,b
        cp 15
        jr nc,ex_nx
        ld a,c
        ld (de),a
        inc de
        inc b
ex_nx:  ld hl,lpos
        inc (hl)
        jr ex_cp
ex_cpe: ld a,b
        ld (wlen),a
        xor a
        ld (de),a
        ld hl,nwords
        inc (hl)
        call lookup
        ld a,(wtype)
        or a
        jr nz,ex_known
        ld a,T_PRE
        call prtext
        call prword
        ld a,T_POST
        jp prtext
ex_known:
        cp 1
        jr nz,ex_nv
        ld a,(verb)
        or a
        jp nz,ex_sk
        ld a,(wid)
        ld (verb),a
        jp ex_sk
ex_nv:  cp 2
        jr nz,ex_n4
        ld a,(dirv)
        cp 255
        jp nz,ex_sk
        ld a,(wid)
        ld (dirv),a
        jp ex_sk
ex_n4:  cp 3
        jr nz,ex_n5
        ld a,(wid)
        or a
        jp z,ex_sk
        ld a,(slots)
        ld hl,slots+2
        and (hl)
        inc a
        jp z,ex_sk      ; preposizione prima dell'oggetto ("turn on lamp"): non separa niente
        ld a,4
        ld (cs),a
        jp ex_sk
ex_n5:  cp 4
        jr nz,ex_n6
        ld a,(cs)
        ld e,a
        ld d,0
        ld hl,slots
        add hl,de
        ld a,(hl)
        cp 255
        jr nz,ex_n5b
        ld a,(wid)
        ld (hl),a
        jp ex_sk
ex_n5b: inc hl
        ld a,(hl)
        cp 255
        jp nz,ex_sk
        ld a,(wid)
        ld (hl),a
        jp ex_sk
ex_n6:  cp 5
        jp nz,ex_sk
        ld a,(cs)
        ld e,a
        ld d,0
        ld hl,slots+2
        add hl,de
        ld a,(hl)
        cp 255
        jr nz,ex_n6b
        ld a,(wid)
        ld (hl),a
        jp ex_sk
ex_n6b: inc hl
        ld a,(hl)
        cp 255
        jp nz,ex_sk
        ld a,(wid)
        ld (hl),a
        jp ex_sk
ex_end: ld a,(nwords)
        or a
        ret z
        ld a,(verb)
        or a
        jr nz,ex_have
        ld a,(dirv)
        cp 255
        jp z,ex_nocap
        ld a,2
        ld (verb),a
ex_have:
        ld a,(verb)
        cp 8
        jp z,do_ripeti
        ld hl,LINE
        ld de,LAST
        ld bc,29
        ldir
        call mergeadj
        ld a,7
        ld (fscope),a
        xor a
        call findtol
        ld (robj),a
        ld a,4
        call findtol
        ld (robj2),a
        call swapobj
        xor a
        call sempty
        ld a,0
        jr nz,ex_pb
        ld a,4
ex_pb:  ld (pbase),a
        call runrules
        ret nz
ex_run: ld a,(verb)
        cp 1
        jp z,do_guarda
        cp 2
        jp z,do_vai
        cp 3
        jp z,do_prendi
        cp 4
        jp z,do_lascia
        cp 5
        jp z,do_inv
        cp 6
        jp z,do_metti
        cp 7
        jr nz,ex_v8
        ld a,T_TEMPO
        jp prtext
ex_v8:  cp 9
        jr nz,ex_oth
        ld a,T_AIUTO
        jp prtext
ex_oth: ld a,(pbase)
        call sempty
        jr z,ex_nien
        ld a,7
        ld (fscope),a
        ld a,(pbase)
        call findobj
        ld b,a
        ld a,(famb)
        or a
        jp nz,amb_msg
        ld a,b
        cp 255
        jr nz,ex_nien
        ld a,T_NONPRE
        jp prtext
ex_nien:
        ld a,T_NIENTE
        jp prtext
ex_nocap:
        ld a,T_NONCAP
        jp prtext

; vai nella direzione dirv
do_vai: ld a,(dirv)
        cp 255
        jr nz,dv1
        ld a,T_DOVE
        jp prtext
dv1:    ld (dsel),a
        call getexit
        ld a,(xst)
        or a
        jr nz,dv2
        ld a,T_NOEXIT
        jp prtext
dv2:    cp 1
        jr z,dv3
        ld hl,(xbp)
        ld a,h
        or l
        jr nz,dv4
        ld a,T_BLOCK
        jp prtext
dv4:    jp prstr
dv3:    ld a,(xtgt)
        ld (room),a
        call describe
; eventi d'ingresso: tutte le regole con comando $FE per la stanza attuale (o per ogni stanza)
events: ld a,$FE
        ld (verb),a
        ld a,(room)
        ld (robj),a
        ld a,$FF
        ld (robj2),a
        ld a,1
        ld (rmode),a
        call runrules
        xor a
        ld (rmode),a
        ret

; matrice della tastiera, una riga per mezza fila: 1 = Caps Shift, 2 = Symbol Shift
KEYTAB: .byte 1,'z','x','c','v'
        .byte 'a','s','d','f','g'
        .byte 'q','w','e','r','t'
        .byte '1','2','3','4','5'
        .byte '0','9','8','7','6'
        .byte 'p','o','i','u','y'
        .byte 13,'l','k','j','h'
        .byte 32,2,'m','n','b'
; lettere accentate come caratteri definiti dall'utente (codici 144-155): a e e' i o u A E E' I O U
udg:
        .byte $20,$10,$38,$04,$3C,$44,$3C,$00
        .byte $20,$10,$38,$44,$78,$40,$3C,$00
        .byte $08,$10,$38,$44,$78,$40,$3C,$00
        .byte $20,$10,$00,$30,$10,$10,$38,$00
        .byte $20,$10,$38,$44,$44,$44,$38,$00
        .byte $20,$10,$44,$44,$44,$44,$3C,$00
        .byte $20,$3C,$42,$42,$7E,$42,$42,$00
        .byte $20,$7E,$40,$7C,$40,$40,$7E,$00
        .byte $08,$7E,$40,$7C,$40,$40,$7E,$00
        .byte $20,$38,$10,$10,$10,$10,$38,$00
        .byte $20,$3C,$42,$42,$42,$42,$3C,$00
        .byte $20,$42,$42,$42,$42,$42,$3C,$00
