import React, { useState, useEffect, useMemo } from "react";
import {
  Badge,
  CircularProgress,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { useApp } from "../../web3/provider";
import { Button, Modal } from "@mui/material";
import Swap from "@project-serum/swap-ui";
import {
  TokenListContainer,
  TokenListProvider,
} from "@solana/spl-token-registry";
import { ConfirmOptions, Connection } from "@solana/web3.js";
import { useSnackbar } from "notistack";
import { NotifyingProvider } from "./notifyer";
import { NodeWallet } from "@project-serum/anchor/dist/provider";
import { Box } from "@mui/system";
import { useHistory, useLocation } from "react-router";
import castle from "../../../assets/castle.png";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export const Topbar = () => {
  const { tokenBalance, wallet, tokenBalanceLoading } = useApp();
  const [showSwap, setShowSwap] = useState(false);
  const [tokenList, setTokenList] = useState<TokenListContainer>();
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const location = useLocation();

  const isCabinet = location.pathname === "/cabinet";

  const [provider] = useMemo(() => {
    const opts: ConfirmOptions = {
      preflightCommitment: "recent",
      commitment: "recent",
    };
    const network = "https://solana-api.projectserum.com";
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new NotifyingProvider(
      connection,
      wallet as unknown as NodeWallet,
      opts,
      (tx: any, err: any) => {
        if (err) {
          enqueueSnackbar(`Error: ${err.toString()}`, {
            variant: "error",
          });
        } else {
          enqueueSnackbar("Transaction sent", {
            variant: "success",
            action: (
              <Button
                color="inherit"
                component="a"
                target="_blank"
                rel="noopener"
                href={`https://explorer.solana.com/tx/${tx}`}
              >
                View on Solana Explorer
              </Button>
            ),
          });
        }
      }
    );
    return [provider];
  }, [enqueueSnackbar, wallet]);

  useEffect(() => {
    new TokenListProvider().resolve().then((list) => {
      const currentList = [...list.getList()].map((t) => {
        if (t.symbol === "ASF") {
          return {
            ...t,
            symbol: "DUN",
            name: "Solhunt Token",
            logoURI: castle,
          };
        }
        return t;
      });
      const newlist = new TokenListContainer(currentList);
      console.log(newlist);
      setTokenList(newlist);
    });
  }, [setTokenList]);

  return (
    <Toolbar style={{ 
      display: "flex", 
      background: "linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(20, 20, 40, 0.95) 100%)",
      backdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
      minHeight: "80px"
    }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexGrow: 1,
          color: "#fff",
          background: "rgba(255, 255, 255, 0.05)",
          borderRadius: "15px",
          padding: "10px 20px",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)"
        }}
      >
        <Typography component="h1" variant="h6" style={{ 
          color: "#fff", 
          fontWeight: 600,
          textShadow: "0 2px 10px rgba(0, 0, 0, 0.5)"
        }}>
          💰 Token Balance:
        </Typography>
        {tokenBalanceLoading ? (
          <CircularProgress 
            size={24} 
            style={{ 
              marginLeft: "15px",
              color: "#667eea"
            }} 
          />
        ) : (
          <Typography
            component="h1"
            variant="h6"
            style={{ 
              color: "#00DDC2", 
              marginLeft: "15px",
              fontWeight: 700,
              textShadow: "0 2px 10px rgba(0, 221, 194, 0.3)"
            }}
          >
            {tokenBalance}
          </Typography>
        )}
      </div>
      <Button
        style={{ 
          background: "linear-gradient(45deg, #2488FF 0%, #1E6BB8 100%)", 
          marginRight: "15px",
          borderRadius: "12px",
          padding: "10px 20px",
          fontWeight: 600,
          textTransform: "none",
          boxShadow: "0 4px 15px rgba(36, 136, 255, 0.3)",
          transition: "all 0.3s ease"
        }}
        variant="contained"
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 6px 20px rgba(36, 136, 255, 0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 4px 15px rgba(36, 136, 255, 0.3)";
        }}
        onClick={() =>
          window.open("https://solbros.github.io/solhunt-store", "_blank")
        }
      >
        🛒 Store
      </Button>
      {isCabinet ? (
        <Button
          style={{ 
            background: "linear-gradient(45deg, #00DDC2 0%, #00B8A3 100%)", 
            marginRight: "15px",
            borderRadius: "12px",
            padding: "10px 20px",
            fontWeight: 600,
            textTransform: "none",
            boxShadow: "0 4px 15px rgba(0, 221, 194, 0.3)",
            transition: "all 0.3s ease"
          }}
          variant="contained"
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(0, 221, 194, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 15px rgba(0, 221, 194, 0.3)";
          }}
          onClick={() => history.push("/")}
        >
          🎮 Game
        </Button>
      ) : (
        <Button
          style={{ 
            background: "linear-gradient(45deg, #00DDC2 0%, #00B8A3 100%)", 
            marginRight: "15px",
            borderRadius: "12px",
            padding: "10px 20px",
            fontWeight: 600,
            textTransform: "none",
            boxShadow: "0 4px 15px rgba(0, 221, 194, 0.3)",
            transition: "all 0.3s ease"
          }}
          variant="contained"
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(0, 221, 194, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 15px rgba(0, 221, 194, 0.3)";
          }}
          onClick={() => history.push("/cabinet")}
        >
          🏆 Trophies
        </Button>
      )}
      <Badge 
        badgeContent={"Alpha"} 
        color="primary"
        style={{
          "& .MuiBadge-badge": {
            background: "linear-gradient(45deg, #667eea 0%, #764ba2 100%)",
            animation: "pulse 2s infinite"
          }
        }}
      >
        <Button
          style={{ 
            background: "linear-gradient(45deg, #667eea 0%, #764ba2 100%)",
            borderRadius: "12px",
            padding: "10px 20px",
            fontWeight: 600,
            textTransform: "none",
            boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
            transition: "all 0.3s ease"
          }}
          variant="contained"
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.3)";
          }}
          onClick={() => setShowSwap(true)}
        >
          🔄 Swap QUEST Tokens
        </Button>
      </Badge>
      {tokenList && (
        <Modal onClose={() => setShowSwap(false)} open={showSwap}>
          {/** @ts-expect-error */}
          <Box sx={{
            ...style,
            background: "linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(20, 20, 40, 0.98) 100%)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "20px",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)"
          }}>
            <Swap provider={provider} tokenList={tokenList} />
          </Box>
        </Modal>
      )}
    </Toolbar>
  );
};
