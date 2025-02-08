// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import {Script} from "forge-std/Script.sol";
import {console2} from "forge-std/Test.sol";
import {WarpAdsDeploymentLib} from "./utils/WarpAdsDeploymentLib.sol";
import {CoreDeploymentLib} from "./utils/CoreDeploymentLib.sol";
import {UpgradeableProxyLib} from "./utils/UpgradeableProxyLib.sol";
import {StrategyBase} from "@eigenlayer/contracts/strategies/StrategyBase.sol";
import {ERC20Mock} from "../test/ERC20Mock.sol";
import {TransparentUpgradeableProxy} from "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";
import {StrategyFactory} from "@eigenlayer/contracts/strategies/StrategyFactory.sol";
import {StrategyManager} from "@eigenlayer/contracts/core/StrategyManager.sol";
import {IRewardsCoordinator} from "@eigenlayer/contracts/interfaces/IRewardsCoordinator.sol";

import {Quorum, StrategyParams, IStrategy} from "@eigenlayer-middleware/src/interfaces/IECDSAStakeRegistryEventsAndErrors.sol";

import "forge-std/Test.sol";

contract WarpAdsDeployer is Script, Test {
    using CoreDeploymentLib for *;
    using UpgradeableProxyLib for address;

    address private deployer;
    address proxyAdmin;
    address rewardsOwner;
    address rewardsInitiator;
    IStrategy warpAdsStrategy;
    CoreDeploymentLib.DeploymentData coreDeployment;
    WarpAdsDeploymentLib.DeploymentData warpAdsDeployment;
    WarpAdsDeploymentLib.DeploymentConfigData warpAdsConfig;
    Quorum internal quorum;
    ERC20Mock token;

    function setUp() public virtual {
        deployer = vm.rememberKey(vm.envUint("PRIVATE_KEY"));
        vm.label(deployer, "Deployer");

        warpAdsConfig = WarpAdsDeploymentLib.readDeploymentConfigValues(
            "config/warpads/",
            block.chainid
        );

        coreDeployment = CoreDeploymentLib.readDeploymentJson(
            "deployments/core/",
            block.chainid
        );
    }

    function run() external {
        vm.startBroadcast(deployer);
        rewardsOwner = warpAdsConfig.rewardsOwner;
        rewardsInitiator = warpAdsConfig.rewardsInitiator;

        token = new ERC20Mock();
        warpAdsStrategy = IStrategy(
            StrategyFactory(coreDeployment.strategyFactory).deployNewStrategy(
                token
            )
        );

        quorum.strategies.push(
            StrategyParams({strategy: warpAdsStrategy, multiplier: 10_000})
        );

        proxyAdmin = UpgradeableProxyLib.deployProxyAdmin();

        warpAdsDeployment = WarpAdsDeploymentLib.deployContracts(
            proxyAdmin,
            coreDeployment,
            quorum,
            rewardsInitiator,
            rewardsOwner
        );

        warpAdsDeployment.strategy = address(warpAdsStrategy);
        warpAdsDeployment.token = address(token);

        vm.stopBroadcast();
        verifyDeployment();
        WarpAdsDeploymentLib.writeDeploymentJson(warpAdsDeployment);
    }

    function verifyDeployment() internal view {
        require(
            warpAdsDeployment.stakeRegistry != address(0),
            "StakeRegistry address cannot be zero"
        );
        require(
            warpAdsDeployment.warpAdsServiceManager != address(0),
            "WarpAdsServiceManager address cannot be zero"
        );
        require(
            warpAdsDeployment.strategy != address(0),
            "Strategy address cannot be zero"
        );
        require(proxyAdmin != address(0), "ProxyAdmin address cannot be zero");
        require(
            coreDeployment.delegationManager != address(0),
            "DelegationManager address cannot be zero"
        );
        require(
            coreDeployment.avsDirectory != address(0),
            "AVSDirectory address cannot be zero"
        );
    }
}
