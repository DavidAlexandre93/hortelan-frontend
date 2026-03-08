import { useMemo, useState } from 'react';
import { Alert, Button, Card, CardContent, Chip, Stack, TextField, Typography } from '@mui/material';

const TX_DEFAULT = {
  to: '',
  amount: '0.001',
};

const toWeiHex = (amount) => {
  const [intPart, decimalPart = ''] = String(amount || '0').split('.');
  const normalizedInt = BigInt(intPart || '0') * 10n ** 18n;
  const normalizedDecimal = BigInt((decimalPart.padEnd(18, '0').slice(0, 18) || '0'));
  return `0x${(normalizedInt + normalizedDecimal).toString(16)}`;
};

export default function BlockchainPanel() {
  const [walletAddress, setWalletAddress] = useState('');
  const [chainName, setChainName] = useState('');
  const [signature, setSignature] = useState('');
  const [txHash, setTxHash] = useState('');
  const [txPayload, setTxPayload] = useState(TX_DEFAULT);
  const [status, setStatus] = useState({ type: 'info', message: 'Conecte sua carteira para registrar ações on-chain.' });

  const hasWallet = typeof window !== 'undefined' && Boolean(window?.ethereum);

  const shortWallet = useMemo(() => {
    if (!walletAddress) {
      return 'Não conectado';
    }

    return `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
  }, [walletAddress]);

  const connectWallet = async () => {
    if (!hasWallet) {
      setStatus({ type: 'warning', message: 'Nenhuma carteira EVM detectada. Instale MetaMask ou equivalente.' });
      return;
    }

    const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });

    setWalletAddress(account || '');
    setChainName(`chainId ${parseInt(chainId, 16)}`);
    setStatus({ type: 'success', message: 'Carteira conectada com sucesso.' });
  };

  const signGardenCheckpoint = async () => {
    if (!hasWallet) {
      setStatus({ type: 'warning', message: 'Conecte uma carteira para assinar checkpoints.' });
      return;
    }

    const message = `Hortelan checkpoint: irrigacao validada em ${new Date().toISOString()}`;
    const hexMessage = `0x${Array.from(message).map((char) => char.charCodeAt(0).toString(16).padStart(2, '0')).join('')}`;
    const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const signedMessage = await window.ethereum.request({
      method: 'personal_sign',
      params: [hexMessage, account],
    });

    setSignature(signedMessage);
    setStatus({ type: 'success', message: 'Checkpoint assinado e pronto para auditoria.' });
  };

  const sendTransaction = async () => {
    if (!hasWallet) {
      setStatus({ type: 'warning', message: 'Conecte uma carteira para enviar transações.' });
      return;
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(txPayload.to)) {
      setStatus({ type: 'error', message: 'Informe um endereço de destino EVM válido.' });
      return;
    }

    const [from] = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const hash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [
        {
          from,
          to: txPayload.to,
          value: toWeiHex(txPayload.amount),
        },
      ],
    });

    setTxHash(hash);
    setStatus({ type: 'success', message: 'Transação enviada para a rede blockchain.' });
  };

  return (
    <Card>
      <CardContent>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ mb: 2 }}>
          <Typography variant="h6">Integração blockchain</Typography>
          <Chip label={shortWallet} color={walletAddress ? 'success' : 'default'} size="small" />
        </Stack>

        <Stack spacing={2}>
          <Alert severity={status.type}>{status.message}</Alert>
          {chainName && <Typography variant="body2" color="text.secondary">Rede conectada: {chainName}</Typography>}

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <Button variant="contained" onClick={connectWallet}>Conectar carteira</Button>
            <Button variant="outlined" onClick={signGardenCheckpoint}>Assinar checkpoint</Button>
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <TextField
              label="Carteira destino"
              value={txPayload.to}
              onChange={(event) => setTxPayload((prev) => ({ ...prev, to: event.target.value }))}
              fullWidth
            />
            <TextField
              label="Valor (ETH)"
              value={txPayload.amount}
              onChange={(event) => setTxPayload((prev) => ({ ...prev, amount: event.target.value }))}
              sx={{ minWidth: { sm: 180 } }}
            />
            <Button variant="outlined" onClick={sendTransaction}>Enviar</Button>
          </Stack>

          {signature && <Typography variant="caption" sx={{ wordBreak: 'break-all' }}>Assinatura: {signature}</Typography>}
          {txHash && <Typography variant="caption" sx={{ wordBreak: 'break-all' }}>Tx hash: {txHash}</Typography>}
        </Stack>
      </CardContent>
    </Card>
  );
}
